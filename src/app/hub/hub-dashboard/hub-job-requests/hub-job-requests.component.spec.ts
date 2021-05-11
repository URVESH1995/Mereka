import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HubJobRequestsComponent } from './hub-job-requests.component';

describe('HubJobRequestsComponent', () => {
  let component: HubJobRequestsComponent;
  let fixture: ComponentFixture<HubJobRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HubJobRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HubJobRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
