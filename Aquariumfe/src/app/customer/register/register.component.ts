import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../../shared/custom-alert/alert.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  emailError: string = '';
  passwordError: string = '';
  firstNameError: string = '';
  lastNameError: string = '';
  generalErrorMessage: string = '';
  verificationCodeError: string = '';
  isVerificationStep: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private alertService: AlertService
  ) {
    this.registerForm = this.formBuilder.group({
      email: [''],  
      password: [''],  
      firstName: [''], 
      lastName: [''],   
      address: [''],
      phone: [''],
      verificationCode: ['']  
    });
  }

  ngOnInit(): void {}

  get isFormValid(): boolean {
    return this.registerForm.valid;
  }

  
  onRegister() {
    this.emailError = '';
    this.passwordError = '';
    this.firstNameError = '';
    this.lastNameError = '';
    this.generalErrorMessage = '';
    this.verificationCodeError = '';

    
    if (!this.isFormValid) {
      this.generalErrorMessage = 'Please fill all required fields correctly.';
      return;
    }

    const credentials = this.registerForm.value;

    this.authService.register(credentials).subscribe({
      next: () => {
        this.isVerificationStep = true; 
      },
      error: (error) => {
        console.error('Register failed:', error);
        if (error.error) {
          this.generalErrorMessage = error.error.message || 'An unknown error occurred.';
          if (error.error.errors) {
            this.emailError = error.error.errors.email || ''; 
            this.passwordError = error.error.errors.password || '';
            this.firstNameError = error.error.errors.firstName || ''; 
            this.lastNameError = error.error.errors.lastName || '';
          }
        } else {
          this.generalErrorMessage = 'An unknown error occurred.';
        }
      }
    });
  }

  onConfirmRegistration() {
    const { email, verificationCode } = this.registerForm.value;

    this.authService.confirmRegistration(email, verificationCode).subscribe({
      next: () => {
        this.alertService.showAlert('Registration successful', 'success');
        this.router.navigate(['/customer']);
      },
      error: (error) => {
        console.error('Verification failed:', error);
        this.verificationCodeError = 'Invalid verification code. Please try again.';
      }
    });
  }

  showPassword: boolean = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
