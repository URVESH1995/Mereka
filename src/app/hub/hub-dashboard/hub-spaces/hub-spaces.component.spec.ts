import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HubSpacesComponent } from './hub-spaces.component';

describe('HubSpacesComponent', () => {
  let component: HubSpacesComponent;
  let fixture: ComponentFixture<HubSpacesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HubSpacesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HubSpacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
