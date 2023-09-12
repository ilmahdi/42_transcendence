import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherRoomsComponent } from './other-rooms.component';

describe('OtherRoomsComponent', () => {
  let component: OtherRoomsComponent;
  let fixture: ComponentFixture<OtherRoomsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OtherRoomsComponent]
    });
    fixture = TestBed.createComponent(OtherRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
