import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveJobDetailComponent } from './active-job-detail.component';

describe('ActiveJobDetailComponent', () => {
  let component: ActiveJobDetailComponent;
  let fixture: ComponentFixture<ActiveJobDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveJobDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveJobDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
