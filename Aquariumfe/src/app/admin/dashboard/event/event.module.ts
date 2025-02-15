import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventRoutingModule } from './event-routing.module';
import { ListEventComponent } from './list-event/list-event.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventFormComponent } from './event-form/event-form.component';


@NgModule({
  declarations: [
    ListEventComponent,
    EventFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    EventRoutingModule,
    ReactiveFormsModule
  ]
})
export class EventModule { }
