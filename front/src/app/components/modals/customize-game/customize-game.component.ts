import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-customize-game',
  templateUrl: './customize-game.component.html',
  styleUrls: ['./customize-game.component.css']
})
export class CustomizeGameComponent {


  constructor() { }

  @Output() closeMeEvent = new EventEmitter();
  @Output() confirmEvent = new EventEmitter();

  public mapId :number = 1;

  onImgClick(id :number) {
    this.mapId = id;
  }

  ngOnInit(): void {
  }

  closeMe() {
    this.closeMeEvent.emit();
  }
  confirm() {
    this.confirmEvent.emit(this.mapId);
  }
}
