import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceDateTimeComponent } from './space-date-time.component';

describe('SpaceDateTimeComponent', () => {
  let component: SpaceDateTimeComponent;
  let fixture: ComponentFixture<SpaceDateTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpaceDateTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceDateTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
