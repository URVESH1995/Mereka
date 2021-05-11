import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerConfirmationComponent } from './learner-confirmation.component';

describe('LearnerConfirmationComponent', () => {
  let component: LearnerConfirmationComponent;
  let fixture: ComponentFixture<LearnerConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnerConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
