import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitedComponent } from './visited.component';

describe('VisitedComponent', () => {
  let component: VisitedComponent;
  let fixture: ComponentFixture<VisitedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
