import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription, firstValueFrom } from 'rxjs';
import { Room } from 'src/app/models/room.model';
import { RoomType } from 'src/app/models/roomType.enum';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user.service';
import { IUserDataShort } from 'src/app/utils/interfaces/user-data.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-creating-rooms',
  templateUrl: './creating-rooms.component.html',
  styleUrls: ['./creating-rooms.component.css']
})
export class CreatingRoomsComponent implements OnInit, OnDestroy {
  private subscriptions:Subscription[] = []

  roomFormular?:Room
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
  public selectedImage: string | ArrayBuffer = '';

  constructor(private chatService:ChatService, private authService:AuthService, private userService:UserService) {
    this.userId = this.authService.getLoggedInUserId();

    this.screenWidth = window.innerWidth;
    window.addEventListener('resize', this.onResize.bind(this));

    const subs1:Subscription = chatService.backToRoomFormular$.subscribe(data=>this.backToRoomFormular = data)
    this.subscriptions.push(subs1)

    // RESET FORMULAR IF USER OPEN CONVERSATION
    const subs2:Subscription = chatService.displayConversation$.subscribe(data=> {
      if (data)
        this.resetRoomFormular()
    })
    this.subscriptions.push(subs2)
  }

  ngOnInit(): void {
    // this.getfriendList();
    this.chatService.getUsers().subscribe({

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
    })
  }

  onResize() {
    this.screenWidth = window.innerWidth;
  }

  onImageSelected(event :any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImage = e.target?.result!;
      };
      reader.readAsDataURL(this.selectedFile);
    }
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

    let image
    if (this.selectedFile) {
      await firstValueFrom(this.uploadImage())
        .then((data) => {
          image = environment.uploadUrl + data.filename;
        });
    }

    let room = {adminId:adminsId, name:this.room.value.name, usersId:usersId, imagePath:image};
    if (usersId.length > 1 && this.room.value.name) {
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

  private uploadImage() : Observable<any> {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile);

      return this.userService.uploadImage(formData)
    }
    return new Observable();
  }

  async createRoom() {
    if (this.types[0].select || this.types[1].select || this.types[2].select) {
      let room:Room;
      let type = this.types.filter(type=> type.select === true)

      

      room = {adminId:this.roomFormular!.adminId, name:this.roomFormular!.name, usersId:this.roomFormular!.usersId, type:type[0].type, password:this.room.value.password, imagePath:this.roomFormular!.imagePath};
      const subs:Subscription = this.chatService.createRoom(room).subscribe();
      this.subscriptions.push(subs)
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
  }

  getfriendList() {
    const subs:Subscription = this.userService.getfriendList(this.userId!).subscribe({

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
   this.subscriptions.push(subs)
 }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe())
  }
}
