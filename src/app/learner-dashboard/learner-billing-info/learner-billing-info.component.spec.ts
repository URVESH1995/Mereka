import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerBillingInfoComponent } from './learner-billing-info.component';

describe('LearnerBillingInfoComponent', () => {
  let component: LearnerBillingInfoComponent;
  let fixture: ComponentFixture<LearnerBillingInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnerBillingInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerBillingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
