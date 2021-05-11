import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HubProfileConfirmationComponent } from './hub-profile-confirmation.component';

describe('HubProfileConfirmationComponent', () => {
  let component: HubProfileConfirmationComponent;
  let fixture: ComponentFixture<HubProfileConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HubProfileConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HubProfileConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
