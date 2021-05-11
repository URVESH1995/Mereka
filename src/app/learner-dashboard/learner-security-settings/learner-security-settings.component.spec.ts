import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerSecuritySettingsComponent } from './learner-security-settings.component';

describe('LearnerSecuritySettingsComponent', () => {
  let component: LearnerSecuritySettingsComponent;
  let fixture: ComponentFixture<LearnerSecuritySettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnerSecuritySettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerSecuritySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
