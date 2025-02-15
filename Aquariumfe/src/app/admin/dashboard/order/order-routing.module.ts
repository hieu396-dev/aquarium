import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListOrderComponent } from './list-order/list-order.component';

const routes: Routes = [
  { path: 'list', component: ListOrderComponent,data: { roles: ['ADMINISTRATOR','INVOICE_STAFF']} },
  { path: 'list/:id', component: ListOrderComponent,data: { roles: ['ADMINISTRATOR','INVOICE_STAFF']} },
  { path: '', redirectTo: 'list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule {}
