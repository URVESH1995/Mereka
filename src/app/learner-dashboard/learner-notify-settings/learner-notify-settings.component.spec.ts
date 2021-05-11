import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerNotifySettingsComponent } from './learner-notify-settings.component';

describe('LearnerNotifySettingsComponent', () => {
  let component: LearnerNotifySettingsComponent;
  let fixture: ComponentFixture<LearnerNotifySettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnerNotifySettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerNotifySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
