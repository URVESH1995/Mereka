import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteExpertsComponent } from './invite-experts.component';

describe('InviteExpertsComponent', () => {
  let component: InviteExpertsComponent;
  let fixture: ComponentFixture<InviteExpertsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteExpertsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteExpertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
