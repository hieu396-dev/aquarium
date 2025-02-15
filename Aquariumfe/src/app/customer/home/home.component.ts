import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { Observable } from 'rxjs';
import { UserInfo } from '../../models/user-info.model';
import { AlertService } from '../../shared/custom-alert/alert.service';

@Component({
  selector: 'app-home',  
  templateUrl: './home.component.html', 
})
export class HomeComponent implements OnInit {
  userInfo$!: Observable<UserInfo | null>;

  constructor(private authService: AuthService, private router: Router,private alertService: AlertService) {}

  ngOnInit(): void {
    this.userInfo$ = this.authService.fetchUserInfo();
    console.log('User info loaded:', this.userInfo$);
    
  }
}
