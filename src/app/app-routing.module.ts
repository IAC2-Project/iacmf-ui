import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductionSystemsComponent } from './production-systems/production-systems.component';
import { TriggersComponent } from './triggers/triggers.component';

const routes: Routes = [
  {path: 'production-systems', component: ProductionSystemsComponent},
  {path: 'triggers', component: TriggersComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
