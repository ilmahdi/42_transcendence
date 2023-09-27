import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { ConfirmService } from 'src/app/services/modals/confirm.service';
import { AuthService } from 'src/app/services/auth.service';
import { CustomSocket } from 'src/app/utils/socket/socket.module';

@Component({
  selector: 'app-more-opts',
  templateUrl: './more-opts.component.html',
  styleUrls: ['./more-opts.component.css']
})
export class MoreOptsComponent implements OnInit {

  constructor(
  ) { }

  @Input() friendshipId :number = -1;
  @Input() friendshipStatus :string = "NONE";
  @Input() isRequestInitiator :boolean = true;

  @Output() unfriendClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() blockClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() cancelClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() sendMessage: EventEmitter<void> = new EventEmitter<void>();
  @Output() playClick: EventEmitter<void> = new EventEmitter<void>();


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
  onPlayClick() {
    this.playClick.emit()
  }

 

  onSendMessage() {
    this.sendMessage.emit();
  }
}
