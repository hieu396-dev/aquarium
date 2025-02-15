import { Component, OnInit } from '@angular/core';
import { AlertService } from './alert.service';

@Component({
  selector: 'app-custom-alert',
  templateUrl: './custom-alert.component.html',
  styleUrls: ['./custom-alert.component.css']
})
export class CustomAlertComponent implements OnInit {
  message: string | null = null;
  alertType: string = 'warning';

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.alertService.alertMessage$.subscribe(message => {
      this.message = message;
    });

    this.alertService.alertType$.subscribe(type => {
      this.alertType = type;
    });
  }

  closeAlert() {
    this.alertService.clearAlert();
  }
}
