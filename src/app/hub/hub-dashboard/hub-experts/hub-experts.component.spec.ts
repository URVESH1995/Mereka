import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HubExpertsComponent } from './hub-experts.component';

describe('HubExpertsComponent', () => {
  let component: HubExpertsComponent;
  let fixture: ComponentFixture<HubExpertsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HubExpertsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HubExpertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
