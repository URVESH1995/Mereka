import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertProfileConfirmationComponent } from './expert-profile-confirmation.component';

describe('ExpertProfileConfirmationComponent', () => {
  let component: ExpertProfileConfirmationComponent;
  let fixture: ComponentFixture<ExpertProfileConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpertProfileConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpertProfileConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
