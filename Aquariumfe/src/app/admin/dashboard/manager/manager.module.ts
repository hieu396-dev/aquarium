import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerRoutingModule } from './manager-routing.module';
import { ListManagerComponent } from './list-manager/list-manager.component';
import { FormManagerComponent } from './manager-form/manager-form.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ListManagerComponent,
    FormManagerComponent
  ],
  imports: [
    CommonModule,
    ManagerRoutingModule,
    FormsModule
  ]
})
export class ManagerModule { }
