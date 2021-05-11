import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HubBillingInformationComponent } from './hub-billing-information.component';

describe('HubBillingInformationComponent', () => {
  let component: HubBillingInformationComponent;
  let fixture: ComponentFixture<HubBillingInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HubBillingInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HubBillingInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
