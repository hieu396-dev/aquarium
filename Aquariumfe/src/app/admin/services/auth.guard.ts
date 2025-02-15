import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const requiredRoles = route.data['roles'] as string[];

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/admin']);
      return false;
    }

    if (requiredRoles && !requiredRoles.some(role => this.authService.hasRole(role))) {
      this.router.navigate(['/admin//dashboard']);
      return false;
    }

    return true;
  }
}
