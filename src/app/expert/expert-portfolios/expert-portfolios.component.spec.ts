import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertPortfoliosComponent } from './expert-portfolios.component';

describe('ExpertPortfoliosComponent', () => {
  let component: ExpertPortfoliosComponent;
  let fixture: ComponentFixture<ExpertPortfoliosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpertPortfoliosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpertPortfoliosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
