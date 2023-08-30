import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Room } from 'src/app/models/room.model';
import { RoomType } from 'src/app/models/roomType.enum';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-creating-rooms',
  templateUrl: './creating-rooms.component.html',
  styleUrls: ['./creating-rooms.component.css']
})
export class CreatingRoomsComponent implements OnInit {
  @Input() roomFormular:any
  types:{type:RoomType, select:boolean}[] = [{type:RoomType.PUBLIC, select:false}, {type:RoomType.PRIVATE, select:false}, {type:RoomType.PROTECTED, select:false}]
  room = new FormGroup({password: new FormControl})
  backToRoomFormular:boolean = false
  error:boolean = false

  constructor(private chatService:ChatService) {
    chatService.backToRoomFormular$.subscribe(data=>this.backToRoomFormular = data)
  }

  ngOnInit(): void {
  }

  onType(type:string) {
    switch (type) {
      case RoomType.PUBLIC:
        this.types[0].select = !this.types[0].select
        this.types[1].select = false
        this.types[2].select = false
        break;
      case RoomType.PRIVATE:
        this.types[1].select = !this.types[1].select
        this.types[0].select = false
        this.types[2].select = false
        break;
      default:
        this.types[2].select = !this.types[2].select
        this.types[1].select = false
        this.types[0].select = false
        break;
    }
  }

  createRoom() {
    if (this.types[0].select || this.types[1].select || this.types[2].select) {
      let room:Room;
      let type = this.types.filter(type=> type.select === true)
      room = {adminId:this.roomFormular.adminId, name:this.roomFormular.name, usersId:this.roomFormular.usersId, type:type[0].type, password:this.room.value.password, imagePath:this.roomFormular.imagePath};
      this.chatService.createRoom(room).subscribe();
      this.types[0].select = false
      this.types[1].select = false
      this.types[2].select = false
      this.chatService.backToRoomFormularSource.next(true);
    }
    else {
      this.error = true;
    }
  }

  back() {
    this.chatService.displayComponents(true, false, false, true, true, false)
    // this.chatService.backToRoomFormularSource.next(true);
  }
}
