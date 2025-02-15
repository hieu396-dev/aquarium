import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { SpeciesComponent } from './species/species.component';
import { TypeComponent } from './type/type.component';
import { CustomerComponent } from './customer/customer.component';
import { AuthGuard } from '../services/auth.guard';
import { HomeComponent } from './home/home.component';
import { TicketComponent } from './ticket/ticket.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'event',
        loadChildren: () => import('./event/event.module').then(m => m.EventModule),
        canActivate: [AuthGuard],
        data: { roles: ['CONTENT_STAFF', 'ADMINISTRATOR']} 
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
        canActivate: [AuthGuard] 
      },
      {
        path: 'aquatic-creatures',
        loadChildren: () => import('./aquatic-creatures/aquatic-creatures.module').then(m => m.AquaticCreaturesModule),
        canActivate: [AuthGuard],
        data: { roles: ['CONTENT_STAFF', 'ADMINISTRATOR']}
      },
      {
        path: 'order',
        loadChildren: () => import('./order/order.module').then(m => m.OrderModule),
        canActivate: [AuthGuard],
        data: { roles: ['ADMINISTRATOR','INVOICE_STAFF']}
      },
      {
        path: 'manager',
        loadChildren: () => import('./manager/manager.module').then(m => m.ManagerModule),
        canActivate: [AuthGuard],
        data: { roles: ['ADMINISTRATOR']}
      },
      {
        path: 'species',
        component:SpeciesComponent,
        canActivate: [AuthGuard] ,
        data: { roles: ['CONTENT_STAFF', 'ADMINISTRATOR']}
      },
      {
        path: 'type',
        component:TypeComponent,
        canActivate: [AuthGuard] ,
        data: { roles: ['CONTENT_STAFF', 'ADMINISTRATOR']}
      },
      {
        path: 'customer',
        component:CustomerComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ADMINISTRATOR']} 
      },
      {
        path: '',
        component:HomeComponent,
        canActivate: [AuthGuard] 
      },
      {
        path: 'ticket/:id',
        component:TicketComponent,
        canActivate: [AuthGuard] ,
        data: { roles: ['ADMINISTRATOR','INVOICE_STAFF']}
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
