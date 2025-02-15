import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventPageComponent } from './event-page/event-page.component';
import { EventDetailPageComponent } from './event-detail-page/event-detail-page.component';
const routes: Routes = [
  { path: 'list', component: EventPageComponent },
  { path: 'details/:id', component: EventDetailPageComponent },
  { path: '', redirectTo: 'list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventRoutingModule {}
