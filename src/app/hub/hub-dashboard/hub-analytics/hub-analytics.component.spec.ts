import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HubAnalyticsComponent } from './hub-analytics.component';

describe('HubAnalyticsComponent', () => {
  let component: HubAnalyticsComponent;
  let fixture: ComponentFixture<HubAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HubAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HubAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
