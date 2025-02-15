import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpeciesService } from '../services/species.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-species',
  templateUrl: './species.component.html',
  styleUrls: ['./species.component.css']
})
export class SpeciesComponent implements OnInit {
  speciesList: any[] = [];
  speciesForm = {
    name: '',
    habitat: '',
    diet: '',
    averageLifespan: null,
    specialCharacteristics: '',
    status: '',
  };
  speciesId: number | null = null;
  nameError: string = '';
  habitatError: string = '';
  dietError: string = '';
  averageLifespanError: string = '';
  statusError: string = '';
  specialCharacteristicsError: string = '';
  generalErrorMessage: string = '';
  isUpdateMode: boolean = false;

  constructor(private router: Router, private speciesService: SpeciesService, private authService : AuthService) {}

  ngOnInit() {
    this.fetchSpecies();
  }

  fetchSpecies() {
    this.speciesService.getAllSpecies().subscribe(
      (data: any) => {
        this.speciesList = data; 
      },
      error => {
        console.error('Error fetching species:', error); 
      }
    );
  }

  editSpecies(id: number) {
    this.toggleForm();
    this.speciesId = id;
    this.isUpdateMode = true;
    this.getSpeciesData(this.speciesId);
  }

  getSpeciesData(id: number) {
    this.speciesService.getSpeciesById(id).subscribe(
      (speciesData: any) => {
        this.speciesForm = {
          name: speciesData.name,
          habitat: speciesData.habitat,
          diet: speciesData.diet,
          averageLifespan: speciesData.averageLifespan,
          specialCharacteristics: speciesData.specialCharacteristics,
          status: speciesData.status,
        };
      },
      (error) => {
        console.error('Failed to fetch species:', error);
        this.generalErrorMessage = 'Could not retrieve species data. Please try again.';
      }
    );
  }

  onSubmit(): void {
    this.resetErrorMessages();
    const speciesData = {
      name: this.speciesForm.name,
      habitat: this.speciesForm.habitat,
      diet: this.speciesForm.diet,
      averageLifespan: this.speciesForm.averageLifespan,
      specialCharacteristics: this.speciesForm.specialCharacteristics,
      status: this.speciesForm.status,
    };

    const speciesObservable = this.isUpdateMode && this.speciesId
      ? this.speciesService.updateSpecies(this.speciesId, speciesData)
      : this.speciesService.createSpecies(speciesData);

    speciesObservable.subscribe(
      (response) => {
        console.log(`${this.isUpdateMode ? 'Species updated' : 'Species created'} successfully:`, response);
        this.fetchSpecies();
        this.resetForm();
      },
      (error) => {
        this.handleErrors(error);
      }
    );
  }
  hasRole(roles: string[]): boolean {
    let hasRole = false;
    this.authService.getUserRoles().subscribe(userRoles => {
      hasRole = userRoles.some(userRole => roles.includes(userRole));
    });
    return hasRole;
  }
  handleErrors(error: any) {
    this.resetErrorMessages();

    if (error.error && error.error.errors) {
      this.nameError = error.error.errors.name || '';
      this.habitatError = error.error.errors.habitat || '';
      this.dietError = error.error.errors.diet || '';
      this.averageLifespanError = error.error.errors.averageLifespan || '';
      this.specialCharacteristicsError = error.error.errors.specialCharacteristics || '';
      this.statusError = error.error.errors.status || '';
    } else {
      this.generalErrorMessage = 'An unknown error occurred. Please try again later.';
    }
  }

  resetErrorMessages() {
    this.nameError = '';
    this.habitatError = '';
    this.dietError = '';
    this.averageLifespanError = '';
    this.specialCharacteristicsError = '';
    this.generalErrorMessage = '';
    this.statusError = '';
  }

  resetForm() {
    this.speciesForm = {
      name: '',
      habitat: '',
      diet: '',
      averageLifespan: null,
      specialCharacteristics: '',
      status:'',
    };
    this.speciesId = null;
    this.isUpdateMode = false;
  }
  toggleForm(): void {
    const formContainer = document.getElementById("formContainer") as HTMLElement;
    if (formContainer) {
        formContainer.style.display = formContainer.style.display === "none" ? "block" : "none";
    }
  }
}

