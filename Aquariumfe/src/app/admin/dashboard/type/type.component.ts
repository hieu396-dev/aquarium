import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TypeService } from '../services/type.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.css']
})
export class TypeComponent implements OnInit {
  typeList: any[] = [];
  typeForm = {
    price: null,
    typeName: '',
    description: '',
    status: '',
  };
  typeId: number | null = null;
  priceError: string = '';
  typeNameError: string = '';
  descriptionError: string = '';
  statusError: string = '';
  generalErrorMessage: string = '';
  isUpdateMode: boolean = false;

  constructor(private router: Router, private typeService: TypeService, private authService :AuthService) { }

  ngOnInit() {
    this.fetchTypes();
  }

  hasRole(roles: string[]): boolean {
    let hasRole = false;
    this.authService.getUserRoles().subscribe(userRoles => {
      hasRole = userRoles.some(userRole => roles.includes(userRole));
    });
    return hasRole;
  }
  fetchTypes() {
    this.typeService.getAllTypes().subscribe(
      (data: any) => {
        this.typeList = data;
      },
      error => {
        console.error('Error fetching types:', error);
      }
    );
  }

  editType(id: number) {
    this.toggleForm();
    this.typeId = id;
    this.isUpdateMode = true;
    this.getTypeData(this.typeId);
  }

  getTypeData(id: number) {
    this.typeService.getTypesById(id).subscribe(
      (typeData: any) => {
        this.typeForm = {
          price: typeData.price,
          typeName: typeData.typeName,
          description: typeData.description,
          status: typeData.status,
        };
      },
      (error) => {
        console.error('Failed to fetch type:', error);
        this.generalErrorMessage = 'Could not retrieve type data. Please try again.';
      }
    );
  }

  onSubmit(): void {
    this.resetErrorMessages();
    const typeData = {
      price: this.typeForm.price,
      typeName: this.typeForm.typeName,
      description: this.typeForm.description,
      status: this.typeForm.status,
    };

    const typeObservable = this.isUpdateMode && this.typeId
      ? this.typeService.updateTypes(this.typeId, typeData)
      : this.typeService.createTypes(typeData);

    typeObservable.subscribe(
      (response) => {
        console.log(`${this.isUpdateMode ? 'Type updated' : 'Type created'} successfully:`, response);
        this.fetchTypes();
        this.resetForm();
      },
      (error) => {
        this.handleErrors(error);
      }
    );
    this.resetForm();
  }

  handleErrors(error: any) {
    this.resetErrorMessages();

    if (error.error && error.error.errors) {
      this.priceError = error.error.errors.price || '';
      this.typeNameError = error.error.errors.typeName || '';
      this.descriptionError = error.error.errors.description || '';
      this.statusError = error.error.errors.status || '';
    } else {
      this.generalErrorMessage = 'An unknown error occurred. Please try again later.';
    }
  }

  resetErrorMessages() {
    this.priceError = '';
    this.typeNameError = '';
    this.descriptionError = '';
    this.statusError = '';
    this.generalErrorMessage = '';
  }

  resetForm(): void {
    this.typeForm = {
      price: null,
      typeName: '',
      description: '',
      status: 'ACTIVE',
    };
    this.isUpdateMode = false;
  }
  isFormVisible: boolean = false; 

  toggleForm(): void {
    const formContainer = document.getElementById("formContainer") as HTMLElement;
    if (formContainer) {
      this.isFormVisible = !this.isFormVisible;
      formContainer.style.display = this.isFormVisible ? "block" : "none";

      const toggleButton = document.getElementById("toggleButton") as HTMLButtonElement;
      if (toggleButton) {
        toggleButton.disabled = true;
        setTimeout(() => {
          toggleButton.disabled = false;
        }, 300);
      }
    }
  }
}

