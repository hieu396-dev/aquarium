import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListManagerComponent } from './list-manager/list-manager.component';
import { FormManagerComponent } from './manager-form/manager-form.component';

const routes: Routes = [
  { path: 'list', component: ListManagerComponent },
  { path: 'form', component: FormManagerComponent,data: { roles: ['ADMINISTRATOR']} },
  { path: 'form/:id', component: FormManagerComponent,data: { roles: ['ADMINISTRATOR']} },
  { path: '', redirectTo: 'list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
