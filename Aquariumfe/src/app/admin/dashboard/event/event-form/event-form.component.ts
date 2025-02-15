import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { AuthService } from '../../../services/auth.service';

interface EventForm {
  eventName: string;
  description: string;
  startDate: Date;
  endDate: Date;
  img: File | null;
  userId: number;
}
@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css'
})
export class EventFormComponent implements OnInit {
  eventForm: EventForm = {
    eventName: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    img: null,
    userId: 1,
  };
  eventId: number | null = null;
  eventNameError: string = ''; 
  descriptionError: string = ''; 
  startDateError: string = ''; 
  endDateError: string = '';
  imgError: string = '';
  generalErrorMessage: string = '';
  isUpdateMode: boolean = false;
  userInfo: any;

  constructor(private route: ActivatedRoute, private router: Router, private eventService: EventService,private authService : AuthService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.eventId = parseInt(id, 10);
        this.isUpdateMode = true;
        this.getEventData(this.eventId);
      }
    });
    this.authService.fetchUserInfo().subscribe(user => {
      this.userInfo = user;
    });
  }

  getEventData(id: number) {
    this.eventService.getEventById(id).subscribe(
      (eventData: any) => {
        this.eventForm = {
          eventName: eventData.eventName,
          description: eventData.description,
          startDate: new Date(eventData.startDate),
          endDate: new Date(eventData.endDate),
          img: null,
          userId: this.userInfo?.id || 1,
        };
      },
      error => {
        console.error('Failed to fetch event:', error);
        this.generalErrorMessage = 'Could not retrieve event data. Please try again.';
      }
    );
  }

  onSubmit(): void {
    this.resetErrorMessages();
    console.log(this.eventForm);
    if (!this.validateDates()) {
      return;
    }

    const formData = this.createFormData();

    const eventObservable = this.isUpdateMode && this.eventId
      ? this.eventService.updateEvent(this.eventId, formData)
      : this.eventService.createEvent(formData);

    eventObservable.subscribe(
      response => {
        console.log(`${this.isUpdateMode ? 'Event updated' : 'Event created'} successfully:`, response);
        this.router.navigate(['/admin/event']);
      },
      error => {
        console.log(this.eventForm.startDate);
        this.handleErrors(error);
      }
    );
  }

  createFormData(): FormData {
    const formData = new FormData();
    formData.append('eventName', this.eventForm.eventName);
    formData.append('description', this.eventForm.description);
    formData.append('startDate', this.eventForm.startDate.toISOString().substring(0,16));
    formData.append('endDate', this.eventForm.endDate.toISOString().substring(0,16));
    formData.append('userId', this.userInfo.id.toString());

    if (this.eventForm.img) {
      formData.append('img', this.eventForm.img);
    }
    return formData;
  }

  handleErrors(error: any) {
    this.resetErrorMessages();

    if (error.error && error.error.errors) {
      this.eventNameError = error.error.errors.eventName || '';
      this.descriptionError = error.error.errors.description || '';
      this.startDateError = error.error.errors.startDate || '';
      this.endDateError = error.error.errors.endDate || '';
      this.imgError = error.error.errors.img || '';
    } else {
      this.generalErrorMessage = 'An unknown error occurred. Please try again later.';
    }
  }

  validateDates(): boolean {
    const startDate = this.eventForm.startDate.getTime();
    const endDate = this.eventForm.endDate.getTime();

    if (startDate >= endDate) {
      this.startDateError = 'Start date must be before end date.';
      return false;
    }
    return true;
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (validTypes.includes(file.type)) {
        this.eventForm.img = file;
        this.imgError = '';
      } else {
        this.imgError = 'Invalid file type. Please upload a JPEG, PNG, or GIF image.';
      }
    }
  }

  resetErrorMessages() {
    this.eventNameError='';
    this.descriptionError='';
    this.startDateError='';
    this.endDateError='';
    this.imgError=''; 
    this.generalErrorMessage = ''; 
  }
  get formattedStartDate(): string {
    return this.formatDateToInputValue(this.eventForm.startDate);
  }
  
  get formattedEndDate(): string {
    return this.formatDateToInputValue(this.eventForm.endDate);
  }
  formatDateToInputValue(date: Date): string {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); 
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}
  onStartDateChange(value: string): void {
    this.eventForm.startDate = new Date(value);
  }
  
  onEndDateChange(value: string): void {
    this.eventForm.endDate = new Date(value);
  }
  
}
