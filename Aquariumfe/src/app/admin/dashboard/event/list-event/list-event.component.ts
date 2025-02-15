import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-list-event',
  templateUrl: './list-event.component.html',
  styleUrls: ['./list-event.component.css']
})
export class ListEventComponent implements OnInit {
  events: any[] = [];
  paginatedEvents: any[] = [];
  page: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;

  constructor(private router: Router, private eventService: EventService, private authService: AuthService) {}

  ngOnInit() {
    this.fetchEvents();
  }

  fetchEvents() {
    this.eventService.getAllEvents().subscribe(
      (data: any) => {
        this.events = data;
        this.totalPages = Math.ceil(this.events.length / this.itemsPerPage);
        this.updatePagination();
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }

  updatePagination() {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedEvents = this.events.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.updatePagination();
    }
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.updatePagination();
    }
  }

  editEvent(id: number) {
    this.router.navigate([`/admin/dashboard/event/form/${id}`]);
  }

  addEvent() {
    this.router.navigate(['/admin/dashboard/event/form']);
  }
  hasRole(roles: string[]): boolean {
    let hasRole = false;
    this.authService.getUserRoles().subscribe(userRoles => {
      hasRole = userRoles.some(userRole => roles.includes(userRole));
    });
    return hasRole;
  }
}
