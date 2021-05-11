import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HubDashboardComponent } from './hub-dashboard.component';

describe('HubDashboardComponent', () => {
  let component: HubDashboardComponent;
  let fixture: ComponentFixture<HubDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HubDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HubDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
