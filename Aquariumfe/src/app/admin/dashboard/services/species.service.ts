// src/app/dashboard/services/species.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpeciesService {
  private apiUrl = 'http://localhost:8080/api/species';

  constructor(private http: HttpClient) {}

  createSpecies(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateSpecies(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  getAllSpecies(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getSpeciesById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
