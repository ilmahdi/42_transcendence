import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { IUserDataShort } from 'src/app/utils/interfaces/user-data.interface';

@Component({
  selector: 'app-more-opts',
  templateUrl: './more-opts.component.html',
  styleUrls: ['./more-opts.component.css']
})
export class MoreOptsComponent implements OnInit {

  constructor(
    private chatService:ChatService,
    private router:Router,
  ) { }

  @Input() friendshipStatus :string = "NONE";
  @Input() friendshipId :number = -1;
  @Input() isRequestInitiator :boolean = true;

  @Output() unfriendClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() blockClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() cancelClick: EventEmitter<void> = new EventEmitter<void>();

  ngOnInit(): void {
  }

  onUnfriendClick() {
    this.unfriendClick.emit()
  }
  onBlockClick() {
    this.blockClick.emit()
  }
  onCancleClick() {
    this.cancelClick.emit()
  }

  onSendMessage() {
    const user:IUserDataShort = this.chatService.openChatFromProfileSource.value.user
    this.chatService.openChatFromProfileSource.next({user:user, open:true})
    this.router.navigateByUrl('/chat');
  }
}
