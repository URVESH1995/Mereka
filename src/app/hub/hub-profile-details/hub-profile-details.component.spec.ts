import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HubProfileDetailsComponent } from './hub-profile-details.component';

describe('HubProfileDetailsComponent', () => {
  let component: HubProfileDetailsComponent;
  let fixture: ComponentFixture<HubProfileDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HubProfileDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HubProfileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
