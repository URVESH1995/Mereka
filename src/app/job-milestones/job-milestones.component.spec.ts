import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobMilestonesComponent } from './job-milestones.component';

describe('JobMilestonesComponent', () => {
  let component: JobMilestonesComponent;
  let fixture: ComponentFixture<JobMilestonesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobMilestonesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobMilestonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
