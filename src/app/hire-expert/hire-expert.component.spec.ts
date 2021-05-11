import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HireExpertComponent } from './hire-expert.component';

describe('HireExpertComponent', () => {
  let component: HireExpertComponent;
  let fixture: ComponentFixture<HireExpertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HireExpertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HireExpertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
