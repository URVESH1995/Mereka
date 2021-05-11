import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HubSecurityCenterComponent } from './hub-security-center.component';

describe('HubSecurityCenterComponent', () => {
  let component: HubSecurityCenterComponent;
  let fixture: ComponentFixture<HubSecurityCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HubSecurityCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HubSecurityCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
