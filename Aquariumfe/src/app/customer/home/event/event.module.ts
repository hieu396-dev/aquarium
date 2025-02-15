import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventPageComponent } from './event-page/event-page.component';
import { EventDetailPageComponent } from './event-detail-page/event-detail-page.component';
import { EventRoutingModule } from './event-routing.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    EventPageComponent,
    EventDetailPageComponent
  ],
  imports: [
    CommonModule,
    EventRoutingModule,
    FormsModule,
  ]
})
export class EventModule { }
