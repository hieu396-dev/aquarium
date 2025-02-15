import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AquaticCreaturesService {
  private apiUrl = 'http://localhost:8080/api/aquatic-creatures';

  constructor(private http: HttpClient) {}

  createCreature(data: FormData): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateCreature(id: number, data: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  getAllCreatures(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getCreatureById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  getAllSpecies(): Observable<any> {
    return this.http.get(`${this.apiUrl}/species`);
  }
}
