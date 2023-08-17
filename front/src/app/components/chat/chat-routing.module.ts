import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat.component';
import { DirectComponent } from './direct/direct.component';
import { RoomsComponent } from './rooms/rooms.component';

const routes: Routes = [
  {path: "", component:ChatComponent},
  {path: "direct", component:DirectComponent},
  {path: "rooms", component:RoomsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
