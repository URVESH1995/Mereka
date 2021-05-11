import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewProposalsComponent } from './review-proposals.component';

describe('ReviewProposalsComponent', () => {
  let component: ReviewProposalsComponent;
  let fixture: ComponentFixture<ReviewProposalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewProposalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewProposalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
