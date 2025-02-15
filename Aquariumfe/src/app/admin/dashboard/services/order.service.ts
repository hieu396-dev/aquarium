import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getAllOrder(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/orders`);
  }
  getOverviewData(): Observable<{ label: string, value: number }[]> {
    return this.http.get<{ label: string, value: number }[]>(`${this.apiUrl}/orders/overview`);
}

  getDetailsData(): Observable<{ label: string, value: number }[]> {
    return this.http.get<{ label: string, value: number }[]>(`${this.apiUrl}/orders/details`);
  }
  getUserOrder(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/order/${id}`);
  }
  getOrderDetails(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/orders/buy/${id}`);
  }
  updateTicketStatus(orderDetailsId: number, status: string) {
    return this.http.put(`${this.apiUrl}/orders/tickets/${orderDetailsId}/status`, status, {
      headers: { 'Content-Type': 'application/json' }
  });
  }
}
