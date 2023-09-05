import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { NavBarModule } from '../nav-bar/nav-bar.module';
import { MenuBarModule} from '../common/menu-bar.module';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: SettingsComponent }
];

@NgModule({
  declarations: [
    SettingsComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    NavBarModule,
    MenuBarModule,
    ReactiveFormsModule,
  ]
})
export class SettingsModule { }
