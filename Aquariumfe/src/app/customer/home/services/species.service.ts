import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpeciesService {
  private apiUrl = 'http://localhost:8080/api/species';

  constructor(private http: HttpClient) {}
  getAllSpecies(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
