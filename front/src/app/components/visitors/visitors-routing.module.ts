import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisitorsComponent } from './visitors.component';
import { TwoFaLoginComponent } from './two-fa-login/two-fa-login.component';

const routes: Routes = [
  {path: "", component:VisitorsComponent},
  { path: 'login/twofa', component: TwoFaLoginComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisitorsRoutingModule { }
