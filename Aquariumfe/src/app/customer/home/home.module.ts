import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HomepageComponent } from './homepage/homepage.component';
import { EventRoutingModule } from './event/event-routing.module';
import { HomeComponent } from './home.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { VisitComponent } from './visit/visit.component';
import { BuyTicketComponent } from './buy-ticket/buy-ticket.component';
import { AnimalRoutingModule } from './animal/animal-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { UserInfoComponent } from './user-info/user-info.component';




@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    HomepageComponent,
    HomeComponent,
    FeedbackComponent,
    VisitComponent,
    BuyTicketComponent,
    UserInfoComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    EventRoutingModule,
    AnimalRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class HomeModule { }
