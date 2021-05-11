import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupLearnerProfileComponent } from './setup-learner-profile.component';

describe('SetupLearnerProfileComponent', () => {
  let component: SetupLearnerProfileComponent;
  let fixture: ComponentFixture<SetupLearnerProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupLearnerProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupLearnerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
