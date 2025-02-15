import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { HomepageComponent } from './homepage/homepage.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { VisitComponent } from './visit/visit.component';
import { BuyTicketComponent } from './buy-ticket/buy-ticket.component';
import { AuthGuard } from '../service/auth.guard';
import { UserInfoComponent } from './user-info/user-info.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: HomepageComponent,
      },
      {
        path: 'userInfo',
        component: UserInfoComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'event',
        loadChildren: () => import('./event/event.module').then(m => m.EventModule)
      },
      {
        path: 'animal',
        loadChildren: () => import('./animal/animal.module').then(m => m.AnimalModule)
      },
      {
        path: 'buy-ticket',
        component: BuyTicketComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'feedback',
        component: FeedbackComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'visit',
        component: VisitComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
