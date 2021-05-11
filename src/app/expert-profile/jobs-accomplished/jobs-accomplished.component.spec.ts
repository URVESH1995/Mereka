import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsAccomplishedComponent } from './jobs-accomplished.component';

describe('JobsAccomplishedComponent', () => {
  let component: JobsAccomplishedComponent;
  let fixture: ComponentFixture<JobsAccomplishedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsAccomplishedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsAccomplishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
