import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyWorkshopBookingsComponent } from './my-workshop-bookings.component';

describe('MyWorkshopBookingsComponent', () => {
  let component: MyWorkshopBookingsComponent;
  let fixture: ComponentFixture<MyWorkshopBookingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyWorkshopBookingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyWorkshopBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
