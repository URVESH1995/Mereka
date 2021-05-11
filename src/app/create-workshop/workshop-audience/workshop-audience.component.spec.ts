import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopAudienceComponent } from './workshop-audience.component';

describe('WorkshopAudienceComponent', () => {
  let component: WorkshopAudienceComponent;
  let fixture: ComponentFixture<WorkshopAudienceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkshopAudienceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopAudienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
