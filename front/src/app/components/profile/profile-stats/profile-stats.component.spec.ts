import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileStatsComponent } from './profile-stats.component';

describe('ProfileOverviewComponent', () => {
  let component: ProfileStatsComponent;
  let fixture: ComponentFixture<ProfileStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileStatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
