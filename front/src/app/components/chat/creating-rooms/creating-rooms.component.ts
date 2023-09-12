import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription, firstValueFrom } from 'rxjs';
import { Room } from 'src/app/models/room.model';
import { RoomType } from 'src/app/models/roomType.enum';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user.service';
import { IUserDataShort } from 'src/app/utils/interfaces/user-data.interface';

@Component({
  selector: 'app-creating-rooms',
  templateUrl: './creating-rooms.component.html',
  styleUrls: ['./creating-rooms.component.css']
})
export class CreatingRoomsComponent implements OnInit, OnDestroy {
  private subscription1?:Subscription
  private subscription2?:Subscription

  @Input() roomFormular:any
  types:{type:RoomType, select:boolean}[] = [{type:RoomType.PUBLIC, select:false}, {type:RoomType.PRIVATE, select:false}, {type:RoomType.PROTECTED, select:false}]
  backToRoomFormular:boolean = false
  error:boolean = false
  screenWidth: number = 1000;
  next:boolean = false

  addRoom:boolean = false
  users:{user:IUserDataShort, added:boolean, admin:boolean}[] = []

  roomFormularTitles:any[] = [{title:'Give your room a name', error:false}, {title:'Add people to your room', error:false}]
  selectedFile?: File
  userId?:number
  room = new FormGroup({name: new FormControl, imagePath: new FormControl, password: new FormControl})

  constructor(private chatService:ChatService, private authService:AuthService, private userService:UserService) {
    this.userId = this.authService.getLoggedInUserId();

    this.screenWidth = window.innerWidth;
    window.addEventListener('resize', this.onResize.bind(this));

    this.subscription1 = chatService.backToRoomFormular$.subscribe(data=>this.backToRoomFormular = data)

    // RESET FORMULAR IF USER OPEN CONVERSATION
    chatService.displayConversation$.subscribe(data=> {
      if (data)
        this.resetRoomFormular()
    })
  }

  ngOnInit(): void {
    this.getfriendList();
  }

  onResize() {
    this.screenWidth = window.innerWidth;
  }

  addToRoom(user:{user:IUserDataShort, added:boolean, admin:boolean}) {
    user.added = !user.added
  }

  addAdmin(user:{user:IUserDataShort, added:boolean, admin:boolean}) {
    user.added = !user.added
    user.admin = !user.admin
  }

  getConversations() {
    this.resetRoomFormular()
    this.addRoom = false
    this.chatService.displayComponents(false, false, false, true, true, false, false)
  }

  handleFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  async nextStep() {
    let usersAdded = this.users.filter(user=> user.added === true)
    let admins = this.users.filter(user=> user.admin === true);
    let usersId: (number)[] = []
    usersAdded.forEach(item=> {
      usersId.push(item.user.id!)
    })
    usersId.push(this.userId!)

    let adminsId: number[] = []
    admins.forEach(admin=> {
      adminsId.push(admin.user.id!)
    })
    adminsId.push(this.userId!)

    const formData = new FormData();
    formData.append('image', this.selectedFile!)
    const avatar  = await firstValueFrom( this.userService.uploadImage(formData));

    let room = {adminId:adminsId, name:this.room.value.name, usersId:usersId, imagePath:avatar.filename};
    if (usersId.length > 1 && this.room.value.name && this.room.value.imagePath) {
      this.roomFormular = room;
      this.next = true
      this.roomFormularTitles[1].error = false
      this.roomFormularTitles[0].error = false
      this.chatService.backToRoomFormularSource.next(false);
      this.resetRoomFormular()
    }
    else {
      if (usersId.length <= 1)
        this.roomFormularTitles[1].error = true
      else
        this.roomFormularTitles[1].error = false
      if (!this.room.value.name)
        this.roomFormularTitles[0].error = true
      else
        this.roomFormularTitles[0].error = false
    }
  }

  resetRoomFormular() {
    this.room.reset()
    this.users.forEach(item=>item.added = false)
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
      console.log(room)
      this.subscription2 = this.chatService.createRoom(room).subscribe();
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
    this.chatService.displayComponents(true, false, false, true, false, false, false)
    // this.chatService.backToRoomFormularSource.next(true);
  }

  getfriendList() {
    this.userService.getfriendList(this.userId!).subscribe({

     next: (response :IUserDataShort[]) => {

      response.forEach((user)=>{
        if (user.id != this.userId) {
          this.users?.push({user:user, added:false, admin:false})
        }
      })
      
     },
     error: error => {
       console.error('Error:', error.error.message); 
     }
   });
 }

  ngOnDestroy(): void {
    this.subscription1?.unsubscribe()
    this.subscription2?.unsubscribe()
  }
}
