import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {provideHttpClient, withFetch } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomerModule } from './customer/customer.module';
import { AdminModule } from './admin/admin.module';
import { RouterModule } from '@angular/router';
import { CustomerComponent } from './customer/customer.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    
    BrowserModule,
    AppRoutingModule,
    BrowserModule,
    ReactiveFormsModule,
    CustomerModule,
    AdminModule,
    RouterModule.forRoot([
      { path: 'customer', component: CustomerComponent },
    ]),
  ],
  providers: [
    provideHttpClient(withFetch()),
   
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
