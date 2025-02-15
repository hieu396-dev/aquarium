import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root', 
})
export class AlertService {
  private alertMessageSource = new BehaviorSubject<string | null>(null);
  alertMessage$ = this.alertMessageSource.asObservable();

  private alertTypeSource = new BehaviorSubject<string>('warning'); 
  alertType$ = this.alertTypeSource.asObservable();

  showAlert(message: string, type: string = 'warning') {
    this.alertMessageSource.next(message);
    this.alertTypeSource.next(type);
  }

  clearAlert() {
    this.alertMessageSource.next(null);
    this.alertTypeSource.next('warning');
  }
}
