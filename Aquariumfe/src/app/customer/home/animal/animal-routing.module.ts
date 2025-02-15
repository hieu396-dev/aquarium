import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnimalPageComponent } from './animal-page/animal-page.component';
import { AnimalDetailPageComponent } from './animal-detail-page/animal-detail-page.component';
import { AnimalListComponent } from './animal-list/animal-list.component';

const routes: Routes = [
  { path: 'animalList', component: AnimalListComponent },
  { path: 'animalList/:speciesId', component: AnimalListComponent },
  { path: 'animalPage', component: AnimalPageComponent },
  { path: 'details/:id', component: AnimalDetailPageComponent },
  { path: '', redirectTo: 'animalPage', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnimalRoutingModule { }
