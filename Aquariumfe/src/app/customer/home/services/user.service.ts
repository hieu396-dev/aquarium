import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/user';
  private apiUrlFeedBack = 'http://localhost:8080/api/feedback';

  constructor(private http: HttpClient) {}

  updateUserInfo(id: number, userInfo: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update/${id}`, userInfo);
  }

  getUserTickets(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/buy/${id}`);
  }
  changePassword(id: number, passwordData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/changePassword/${id}`, passwordData);
  }
  addFeedback(feedback: any): Observable<any> {
    return this.http.post<any>(this.apiUrlFeedBack, feedback);
  }
}
