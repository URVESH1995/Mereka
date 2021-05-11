import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HubExperiencesComponent } from './hub-experiences.component';

describe('HubExperiencesComponent', () => {
  let component: HubExperiencesComponent;
  let fixture: ComponentFixture<HubExperiencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HubExperiencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HubExperiencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
