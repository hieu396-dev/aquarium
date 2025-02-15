import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnimalRoutingModule } from './animal-routing.module';
import { AnimalPageComponent } from './animal-page/animal-page.component';
import { AnimalDetailPageComponent } from './animal-detail-page/animal-detail-page.component';
import { FormsModule } from '@angular/forms';
import { AnimalListComponent } from './animal-list/animal-list.component';


@NgModule({
  declarations: [
    AnimalPageComponent,
    AnimalDetailPageComponent,
    AnimalListComponent
  ],
  imports: [
    CommonModule,
    AnimalRoutingModule,
    FormsModule
  ]
})
export class AnimalModule { }
