import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizeGameComponent } from './customize-game.component';

describe('CustomizeGameComponent', () => {
  let component: CustomizeGameComponent;
  let fixture: ComponentFixture<CustomizeGameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomizeGameComponent]
    });
    fixture = TestBed.createComponent(CustomizeGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
