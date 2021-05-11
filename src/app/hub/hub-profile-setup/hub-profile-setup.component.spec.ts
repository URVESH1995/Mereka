import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HubProfileSetupComponent } from './hub-profile-setup.component';

describe('HubProfileSetupComponent', () => {
  let component: HubProfileSetupComponent;
  let fixture: ComponentFixture<HubProfileSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HubProfileSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HubProfileSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
