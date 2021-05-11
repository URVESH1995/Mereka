import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerPrivacySettingsComponent } from './learner-privacy-settings.component';

describe('LearnerPrivacySettingsComponent', () => {
  let component: LearnerPrivacySettingsComponent;
  let fixture: ComponentFixture<LearnerPrivacySettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnerPrivacySettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerPrivacySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
