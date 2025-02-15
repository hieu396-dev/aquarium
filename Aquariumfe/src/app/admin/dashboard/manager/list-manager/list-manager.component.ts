import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-list-manager',
  templateUrl: './list-manager.component.html',
  styleUrl: './list-manager.component.css'
})
export class ListManagerComponent {
  Listmana: any[] = [];
  filteredListmana: any[] = [];
  searchTerm: string = '';

  constructor(private router: Router, private userService: UserService, private authService: AuthService) {}

  ngOnInit() {
    this.loadManagers();
  }

  loadManagers() {
    this.userService.getManagers().subscribe(
      (data) => {
        this.Listmana = data;
        this.filteredListmana = data;
      },
      (error) => {
        console.error('Error fetching managers', error);
      }
    );
  }

  addUser() {
    this.router.navigate(['/admin/dashboard/manager/form']);
  }

  searchUser(): void {
    const searchInput = this.searchTerm.toLowerCase();
    this.filteredListmana = this.Listmana.filter((user) => {
      return (
        (user.firstName && user.firstName.toLowerCase().includes(searchInput)) ||
        (user.email && user.email.toLowerCase().includes(searchInput))
      );
    });
  }
  

  toggleStatus(user: any): void {
    const newStatus = user.accountStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    user.accountStatus = newStatus;

    this.userService.updateUserStatus(user.id, newStatus).subscribe(
      (response) => {
        console.log('User status updated successfully', response);
      },
      (error) => {
        console.error('Error updating user status', error);
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
}
