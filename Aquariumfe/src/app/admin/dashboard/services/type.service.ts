// src/app/dashboard/services/species.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TypeService {
  private apiUrl = 'http://localhost:8080/api/types';

  constructor(private http: HttpClient) {}

  createTypes(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateTypes(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  getAllTypes(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getTypesById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
