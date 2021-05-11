import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertOverviewComponent } from './expert-overview.component';

describe('ExpertOverviewComponent', () => {
  let component: ExpertOverviewComponent;
  let fixture: ComponentFixture<ExpertOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpertOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpertOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
