import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopBasicDetailsComponent } from './workshop-basic-details.component';

describe('WorkshopBasicDetailsComponent', () => {
  let component: WorkshopBasicDetailsComponent;
  let fixture: ComponentFixture<WorkshopBasicDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkshopBasicDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopBasicDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
