import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { UserInfo } from '../../models/user-info.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';
  private loggedInStatus = new BehaviorSubject<boolean>(false);
  private userRoles = new BehaviorSubject<string[]>([]);

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) { 
      const token = localStorage.getItem('adminToken');
      if (token) {
        this.loggedInStatus.next(true);
        this.fetchUserInfo().subscribe(userInfo => {
          this.userRoles.next([userInfo.roleName]); 
        });
      }
    }
  }


  fetchUserInfo(): Observable<UserInfo> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
    });
    return this.http.get<UserInfo>(`${this.apiUrl}/user/info`, { headers });
  }

  getUserRoles(): Observable<string[]> {
    return this.userRoles.asObservable();
  }

  hasRole(role: string): boolean {
    const roles = this.userRoles.getValue();
    return roles.includes(role);
  }

  login(credentials: { email: string; password: string; targetRole: string }): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/auth/login`, credentials, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }).pipe(
      tap(response => {
        this.setAdminToken(response.token);
        this.fetchUserInfo().subscribe(userInfo => {
          this.userRoles.next([userInfo.roleName]);  
        });
      }),
    );
  }

  private setAdminToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {  
      localStorage.clear();
      localStorage.setItem('adminToken', token); 
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {  
      return localStorage.getItem('adminToken');
    }
    return null;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) { 
      localStorage.removeItem('adminToken');
    }
    this.userRoles.next([]); 
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  changePassword(id: number, passwordData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/changePassword/${id}`, passwordData);
  }
}
