import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertServicesComponent } from './expert-services.component';

describe('ExpertServicesComponent', () => {
  let component: ExpertServicesComponent;
  let fixture: ComponentFixture<ExpertServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpertServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpertServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
