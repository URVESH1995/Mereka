import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerBackgroundComponent } from './learner-background.component';

describe('LearnerBackgroundComponent', () => {
  let component: LearnerBackgroundComponent;
  let fixture: ComponentFixture<LearnerBackgroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnerBackgroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
