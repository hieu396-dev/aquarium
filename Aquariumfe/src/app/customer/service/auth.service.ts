import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { UserInfo } from '../../models/user-info.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrlLogin = 'http://localhost:8080/api/auth/login';
  private apiUrl = 'http://localhost:8080/api/user/info'; 
  private apiUrlRegister = 'http://localhost:8080/api/auth';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(credentials: { email: string; password: string, targetRole: string }): Observable<any> {
    return this.http.post<{ token: string }>(this.apiUrlLogin, credentials, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      tap(response => {
        this.setCustomerToken(response.token);
      }),
    );
  }

  register(credentials: { firstName: string; lastName: string; address: string; phone: string; email: string; password: string }): Observable<any> {
    return this.http.post<{ message: string }>(`${this.apiUrlRegister}/register`, credentials, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    });
  }

  confirmRegistration(email: string, code: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrlRegister}/confirm-registration`, { email, code }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }).pipe(
      tap(response => {
        if (response && response.token) {
          this.setCustomerToken(response.token);  
        }
      }),
    );
  }

  private setCustomerToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
      localStorage.setItem('customerToken', token);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('customerToken');
    }
    return null;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('customerToken');
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  fetchUserInfo(): Observable<UserInfo> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
    });
    return this.http.get<UserInfo>(`${this.apiUrl}`, { headers });
  }
}
