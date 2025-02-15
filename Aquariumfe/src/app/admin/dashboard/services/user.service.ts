import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/api'; 

  constructor(private http: HttpClient) { }

  getCustomers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/customers`);
  }
  getManagers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/managers`);
  }
  registerAdmin(adminData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register-admin`, adminData);
  }
  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/role`).pipe(
      map(roles => roles.filter(role => role.roleName !== 'CUSTOMER'))
    );
  }
  updateUserStatus(userId: number, status: string): Observable<any> {
    const url = `${this.apiUrl}/user/update-status/${userId}?status=${status}`;
    return this.http.put(url, {});
  }
}
