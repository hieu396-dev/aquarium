import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = 'http://localhost:8080/api/events';

  constructor(private http: HttpClient) {}

  getAllEvents(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((events: any[]) => 
        events
          .filter(event => new Date(event.endDate) >= new Date()) 
      )
    );
}
  getEventById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  getAllEventsExcluding(id: number): Observable<any> {
    return this.getAllEvents().pipe(
      map((events: any[]) => 
        events.filter(event => event.id !== id)
      )
    );
  }
}
