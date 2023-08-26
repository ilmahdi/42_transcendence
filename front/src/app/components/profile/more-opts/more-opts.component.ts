import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-more-opts',
  templateUrl: './more-opts.component.html',
  styleUrls: ['./more-opts.component.css']
})
export class MoreOptsComponent implements OnInit {

  constructor(
  ) { }

  @Input() friendshipStatus :string = "NONE";
  @Input() friendshipId :number = -1;

  @Output() unfriendClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() blockClick: EventEmitter<void> = new EventEmitter<void>();

  ngOnInit(): void {
  }

  onUnfriendClick() {
    this.unfriendClick.emit()
  }
  onBlockClick() {
    this.blockClick.emit()
  }

}
