import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListAquaticCreaturesComponent } from './list-aquatic-creatures/list-aquatic-creatures.component';
import { AquaticCreaturesFormComponent } from './aquatic-creatures-form/aquatic-creatures-form.component';

const routes: Routes = [
  { path: 'list', component: ListAquaticCreaturesComponent },
  { path: 'form', component: AquaticCreaturesFormComponent,data: { roles: ['CONTENT_STAFF', 'ADMINISTRATOR']} },
  { path: 'form/:id', component: AquaticCreaturesFormComponent,data: { roles: ['CONTENT_STAFF', 'ADMINISTRATOR']} },
  { path: '', redirectTo: 'list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AquaticCreaturesRoutingModule {}
