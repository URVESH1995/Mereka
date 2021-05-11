import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HubBasicDetailsComponent } from './hub-basic-details.component';

describe('HubBasicDetailsComponent', () => {
  let component: HubBasicDetailsComponent;
  let fixture: ComponentFixture<HubBasicDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HubBasicDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HubBasicDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
