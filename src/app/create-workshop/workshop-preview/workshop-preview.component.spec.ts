import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopPreviewComponent } from './workshop-preview.component';

describe('WorkshopPreviewComponent', () => {
  let component: WorkshopPreviewComponent;
  let fixture: ComponentFixture<WorkshopPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkshopPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
