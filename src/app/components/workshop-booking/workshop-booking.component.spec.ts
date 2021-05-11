import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopBookingComponent } from './workshop-booking.component';

describe('WorkshopBookingComponent', () => {
  let component: WorkshopBookingComponent;
  let fixture: ComponentFixture<WorkshopBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkshopBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
