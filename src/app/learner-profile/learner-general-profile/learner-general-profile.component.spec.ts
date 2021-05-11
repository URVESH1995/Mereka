import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerGeneralProfileComponent } from './learner-general-profile.component';

describe('LearnerGeneralProfileComponent', () => {
  let component: LearnerGeneralProfileComponent;
  let fixture: ComponentFixture<LearnerGeneralProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnerGeneralProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerGeneralProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
