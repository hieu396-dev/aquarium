import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {

  private apiUrl = 'http://localhost:8080/api/aquatic-creatures';

  constructor(private http: HttpClient) {}

  getAllAnimals(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getAnimalsBySpecies(species: any,id: number): Observable<any[]> {
  return this.getAllAnimals().pipe(
    map((animals: any[]) => animals.filter(animal => animal.species.name === species && animal.id !== id).slice(0, 4))
  );
}
  getAnimalsById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  getAllDistinctCreatures(): Observable<any> {
    return this.http.get(`${this.apiUrl}/distinct-creatures`);
  }
}
