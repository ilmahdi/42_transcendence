import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { NavBarModule } from '../nav-bar/nav-bar.module';
import { OnlineModule } from '../right-bar/online/online.module';
import { MenuBarModule} from '../common/menu-bar.module';
import { RouterModule, Routes } from '@angular/router';

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
    OnlineModule,
  ]
})
export class SettingsModule { }
