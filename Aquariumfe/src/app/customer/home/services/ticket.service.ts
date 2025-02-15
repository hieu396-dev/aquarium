
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  createTicket(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/buy`, data);
  }
  getAllTypeOnActive(): Observable<any>{
    return this.http.get(`${this.apiUrl}/types/customer`);
  }
  getUserByToken(token: String): Observable<any>{
    return this.http.get(`${this.apiUrl}/user/info`);
  }
}
