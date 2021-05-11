import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLearnerProfileComponent } from './create-learner-profile.component';

describe('CreateLearnerProfileComponent', () => {
  let component: CreateLearnerProfileComponent;
  let fixture: ComponentFixture<CreateLearnerProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLearnerProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLearnerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
