import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerProfileComponent } from './learner-profile.component';

describe('LearnerProfileComponent', () => {
  let component: LearnerProfileComponent;
  let fixture: ComponentFixture<LearnerProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnerProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
