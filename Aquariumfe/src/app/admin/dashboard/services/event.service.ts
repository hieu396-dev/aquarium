// src/app/dashboard/services/event.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = 'http://localhost:8080/api/events';

  constructor(private http: HttpClient) {}

  createEvent(data: FormData): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateEvent(id: number, data: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  getAllEvents(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getEventById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
