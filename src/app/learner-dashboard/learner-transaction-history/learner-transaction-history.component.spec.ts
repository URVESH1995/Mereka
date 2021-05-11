import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerTransactionHistoryComponent } from './learner-transaction-history.component';

describe('LearnerTransactionHistoryComponent', () => {
  let component: LearnerTransactionHistoryComponent;
  let fixture: ComponentFixture<LearnerTransactionHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnerTransactionHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerTransactionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
