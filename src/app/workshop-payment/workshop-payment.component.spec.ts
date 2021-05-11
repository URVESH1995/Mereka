import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopPaymentComponent } from './workshop-payment.component';

describe('WorkshopPaymentComponent', () => {
  let component: WorkshopPaymentComponent;
  let fixture: ComponentFixture<WorkshopPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkshopPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
