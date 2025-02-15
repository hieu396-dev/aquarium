import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-manager-form',
  templateUrl: './manager-form.component.html',
  styleUrls: ['./manager-form.component.css']
})
export class FormManagerComponent implements OnInit {
  // Admin form model
  adminForm = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    address: '',
    phone: '',
    roleId: 1 // Default roleId for Admin
  };

  // Error messages
  firstNameError: string = '';
  lastNameError: string = '';
  emailError: string = '';
  passwordError: string = '';
  phoneError: string = '';
  addressError: string = '';
  roleIdError: string = '';

  roles: any[] = [];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadRoles();
  }


  loadRoles(): void {
    this.userService.getRoles().subscribe(
      (data) => {
        this.roles = data; 
      },
      (error) => {
        console.error('Error fetching roles', error);
      }
    );
  }

  
  onSubmit(): void {
    this.userService.registerAdmin(this.adminForm).subscribe(
      (response) => {
        console.log('Admin created successfully', response);
        this.router.navigate(['/admin/dashboard']);
      },
      (error) => {
        console.error('Register failed:', error);
          if (error.error.errors) {
            this.emailError = error.error.errors.email || ''; 
            this.passwordError = error.error.errors.password || '';
            this.firstNameError = error.error.errors.firstName || ''; 
            this.lastNameError = error.error.errors.lastName || '';
          }
      }
    );
  }

  goBack(): void {
    window.history.back();
  }
}
