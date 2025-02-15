import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomAlertComponent } from './custom-alert/custom-alert.component';



@NgModule({
  declarations: [CustomAlertComponent],
  imports: [CommonModule],
  exports: [CustomAlertComponent]
})
export class SharedModule { }
