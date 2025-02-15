import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserInfo } from '../../../../models/user-info.model';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-get-profile',
  templateUrl: './get-profile.component.html',
  styleUrls: ['./get-profile.component.css']
})
export class GetProfileComponent implements OnInit {
  userInfo: any;
  date: String = '';
  passwordForm: FormGroup;  
  generalErrorMessage: string = '';

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private fb: FormBuilder
  ) {
   
    this.passwordForm = this.fb.group({
      oldPassword: [''],
      newPassword: [''],
      confirmPassword: ['']
    }, {
      validator: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    this.authService.fetchUserInfo().subscribe(user => {
      this.userInfo = user;
      if (this.userInfo?.createdAt) {
        const createdDate = new Date(this.userInfo.createdAt); 
        const day = createdDate.getDate();
        const month = createdDate.getMonth() + 1; 
        const year = createdDate.getFullYear();
        this.date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      }
    });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { 'passwordMismatch': true };
  }

  toggleChangePassword(): void {
    const changePasswordSection = document.getElementById('changePasswordSection') as HTMLElement | null;
    if (changePasswordSection) {
      if (changePasswordSection.style.display === "none" || changePasswordSection.style.display === "") {
        changePasswordSection.style.display = "block";
      } else {
        changePasswordSection.style.display = "none";
      }
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      const passwordData = this.passwordForm.value;
      this.authService.changePassword(this.userInfo?.id, passwordData).subscribe({
        next: (response) => {
          this.passwordForm.reset();
          alert('Mật khẩu đã được thay đổi thành công');
        },
        error: (error) => {
          if (error.error) {
            this.generalErrorMessage = error.error.message || 'An unknown error occurred.';
            if (error.error.errors) {
              alert(error.error.errors.oldPassword || error.error.errors.newPassword);
            }
          } else {
            this.generalErrorMessage = 'An unknown error occurred.';
          }
        }
      });
    } else {
      alert('Vui lòng kiểm tra lại các trường mật khẩu!');
    }
  }
}
