import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AdminComponent } from '../admin.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  emailError: string = ''; 
  passwordError: string = ''; 
  generalErrorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private admin: AdminComponent
  ) {
    this.loginForm = this.formBuilder.group({
      email: [''], 
      password: ['']
    });
  }

  ngOnInit(): void {
  }

  onLogin() {
    this.emailError = '';
    this.passwordError = '';
    this.generalErrorMessage = '';
  
    const credentials = this.loginForm.value;
  
    const email = credentials['email'];
    const password = credentials['password'];
  
    const loginCredentials = { email, password, targetRole: 'admin' };
  
    this.authService.login(loginCredentials).subscribe({
      next: (response) => {
        this.router.navigate(['/admin/dashboard']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        if (error.error) {
          this.generalErrorMessage = error.error.message || 'An unknown error occurred.';
          if (error.error.errors) {
            this.emailError = error.error.errors.email || '';
            this.passwordError = error.error.errors.password || '';
          }
          if(error.error.errors.role){
            this.emailError = error.error.errors.role || '';
          }
          if(error.error.errors.status){
            this.emailError = error.error.errors.status || '';
          }
        } else {
          this.generalErrorMessage = 'An unknown error occurred.';
        }
      }
    });
  } 
}
