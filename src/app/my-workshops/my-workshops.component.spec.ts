import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyWorkshopsComponent } from './my-workshops.component';

describe('MyWorkshopsComponent', () => {
  let component: MyWorkshopsComponent;
  let fixture: ComponentFixture<MyWorkshopsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyWorkshopsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyWorkshopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
