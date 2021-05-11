import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceAvailabilityComponent } from './space-availability.component';

describe('SpaceAvailabilityComponent', () => {
  let component: SpaceAvailabilityComponent;
  let fixture: ComponentFixture<SpaceAvailabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpaceAvailabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
