import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css']
})
export class EventPageComponent implements OnInit {
  events: any[] = [];  
  originalEvents: any[] = [];
  filteredEvents: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  eventsPerPage: number = 3;
  totalPages: number = 0;

  constructor(private router: Router, private eventService: EventService) {}

  ngOnInit() {
    this.fetchEvents();
  }

  fetchEvents() {
    this.eventService.getAllEvents().subscribe(
      (data: any[]) => {
        this.originalEvents = data;
        this.filteredEvents = [...this.originalEvents];
        this.totalPages = Math.ceil(this.filteredEvents.length / this.eventsPerPage);
        this.updateEvents();
      },
      error => {
        console.error('Error fetching events:', error);
      }
    );
  }

  onSearch() {
    this.currentPage = 1;
    const searchTermLower = this.searchTerm.toLowerCase();

    if (this.searchTerm) {
      this.filteredEvents = this.originalEvents.filter(event =>
        event.eventName && event.eventName.toLowerCase().includes(searchTermLower)
      );
    } else {
      this.filteredEvents = [...this.originalEvents];
    }

    this.totalPages = Math.ceil(this.filteredEvents.length / this.eventsPerPage);
    this.updateEvents();
  }

  updateEvents() {
    const startIndex = (this.currentPage - 1) * this.eventsPerPage;
    const endIndex = startIndex + this.eventsPerPage;
    this.events = this.filteredEvents.slice(startIndex, endIndex);
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateEvents();
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateEvents();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updateEvents();
  }

  getPageNumbers(): number[] {
    const pageNumbers = [];
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, this.currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  }
}
