import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopAdditionalInfoComponent } from './workshop-additional-info.component';

describe('WorkshopAdditionalInfoComponent', () => {
  let component: WorkshopAdditionalInfoComponent;
  let fixture: ComponentFixture<WorkshopAdditionalInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkshopAdditionalInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopAdditionalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
