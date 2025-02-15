import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { AlertService } from '../../../shared/custom-alert/alert.service';

interface Ticket {
  userId: number;
  ticketId: number;
  type: string;
  number: number;
  status: string;
  buyDate: string;
  expirationDate: string;
  total: number;
}
@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  userInfoForm: FormGroup;
  passwordForm: FormGroup;
  userInfo: any;
  oldPasswordError: string = ''; 
  newPasswordError: string = ''; 
  generalErrorMessage: string = '';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private userService: UserService,
    private alertService: AlertService
  ) {
    this.userInfoForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      phone: [''],
      address: ['']
    });

    this.passwordForm = this.fb.group({
      oldPassword: [''],
      newPassword: ['']
    });
  }

  tickets: Ticket[]=[];
  currentPage: number = 1;
  itemsPerPage: number = 15;
  paginatedTickets: Ticket[] = [];
  ngOnInit(): void {
    this.authService.fetchUserInfo().subscribe((info) => {
      if (info) {
        this.userInfo = info;
        this.userInfoForm.patchValue(info);
        this.userService.getUserTickets(this.userInfo.id).subscribe(
          (data: any) => {
            this.tickets = data;
            this.paginateTickets(); 
          },
          error => {
            console.error('Error fetching events:', error); 
          }
        );
      }
    });
    
  }
  get totalPages(): number {
    return Math.ceil(this.tickets.length / this.itemsPerPage);
  }
  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.tickets.length) {
      this.currentPage++;
      this.paginateTickets();
    }
  }
  
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateTickets();
    }
  }
  
  paginateTickets(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedTickets = this.tickets.slice(start, end);
  }
  
  sortedColumn: string = '';
ascending: boolean = true;

sortTickets(column: keyof Ticket): void {
  if (this.sortedColumn === column) {
      this.ascending = !this.ascending;
  } else {
      this.sortedColumn = column;
      this.ascending = true;
  }

  this.paginatedTickets.sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
      if (typeof aValue === 'number' && typeof bValue === 'number') {
          return this.ascending ? aValue - bValue : bValue - aValue;
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
          return this.ascending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      return 0;
  });
}


  updateUserInfo(): void {
    if (this.userInfoForm.valid) {
      const updatedInfo = this.userInfoForm.value;
      this.userService.updateUserInfo(this.userInfo.id, updatedInfo).subscribe({
        next: (response) => {
        },
        error: (error) => {
          if (error.error) {
            this.generalErrorMessage = error.error.message || 'An unknown error occurred.';
            if (error.error.errors) { 
              this.alertService.showAlert(error.error.errors.firstName);
              this.alertService.showAlert(error.error.errors.lastName);
              this.alertService.showAlert(error.error.errors.email);
              this.alertService.showAlert(error.error.errors.address);
              this.alertService.showAlert(error.error.errors.phone);
            }
          } else {
            this.generalErrorMessage = 'An unknown error occurred.';
          }
        }
      });
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      const passwordData = this.passwordForm.value;
      this.userService.changePassword(this.userInfo.id, passwordData).subscribe({
        next: (response) => {
          this.passwordForm.reset();
        },
        error: (error) => {
          if (error.error) {
            this.generalErrorMessage = error.error.message || 'An unknown error occurred.';
            if (error.error.errors) { 
              this.alertService.showAlert(error.error.errors.oldPassword);
              this.alertService.showAlert(error.error.errors.newPassword);
            }
          } else {
            this.generalErrorMessage = 'An unknown error occurred.';
          }
        }
      });
    }
  }
  showPasswordFields: boolean = false;
  togglePasswordFields() {
    this.showPasswordFields = !this.showPasswordFields;
  }
}
