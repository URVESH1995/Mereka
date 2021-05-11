import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertiseDetailsComponent } from './expertise-details.component';

describe('ExpertiseDetailsComponent', () => {
  let component: ExpertiseDetailsComponent;
  let fixture: ComponentFixture<ExpertiseDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpertiseDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpertiseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
