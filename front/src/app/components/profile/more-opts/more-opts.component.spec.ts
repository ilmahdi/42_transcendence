import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreOptsComponent } from './more-opts.component';

describe('MoreOptsComponent', () => {
  let component: MoreOptsComponent;
  let fixture: ComponentFixture<MoreOptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoreOptsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoreOptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
