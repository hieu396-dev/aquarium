import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      console.log('User is logged in.');
      return true;
    } else {
      console.log('User is not logged in. Redirecting to login page.');
      this.router.navigate(['/customer/login']);
      return false;
    }
  }
}
