import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { ActivatedRoute, Router } from '@angular/router';

interface Event {
  id: number;
  eventName: string;
  description: string;
  startDate: Date;
  endDate: Date;
  img: File | null;
}

@Component({
  selector: 'app-event-detail-page',
  templateUrl: './event-detail-page.component.html',
  styleUrls: ['./event-detail-page.component.css'],
})
export class EventDetailPageComponent implements OnInit {
  event: Event = {
    id: 0,
    eventName: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    img: null,
  };

  otherEvents: Event[] = [];

  constructor(private eventService: EventService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.getEventData(parseInt(id, 10));
      } else {
        console.error('Event ID is missing in the URL.');
        this.router.navigate(['/events']);
      }
    });
  }

  getEventData(id: number) {
    this.eventService.getEventById(id).subscribe(
      (eventdata: Event) => {
        this.event = eventdata;
        this.getOtherEventsExcluding(id);
      },
      error => {
        console.error('Failed to fetch event:', error);
        this.router.navigate(['/events']);
      }
    );
  }

  getOtherEventsExcluding(id: number) {
    this.eventService.getAllEventsExcluding(id).subscribe(
      (events: Event[]) => {
        this.otherEvents = events;
      },
      error => {
        console.error('Failed to fetch other events:', error);
      }
    );
  }
}
