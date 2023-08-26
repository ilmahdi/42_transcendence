import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatingRoomsComponent } from './creating-rooms.component';

describe('CreatingRoomsComponent', () => {
  let component: CreatingRoomsComponent;
  let fixture: ComponentFixture<CreatingRoomsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatingRoomsComponent]
    });
    fixture = TestBed.createComponent(CreatingRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
