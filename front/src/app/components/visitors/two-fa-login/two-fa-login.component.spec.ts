import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoFaLoginComponent } from './two-fa-login.component';

describe('TwoFaLoginComponent', () => {
  let component: TwoFaLoginComponent;
  let fixture: ComponentFixture<TwoFaLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TwoFaLoginComponent]
    });
    fixture = TestBed.createComponent(TwoFaLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
