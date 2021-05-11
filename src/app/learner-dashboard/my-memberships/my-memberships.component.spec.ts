import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMembershipsComponent } from './my-memberships.component';

describe('MyMembershipsComponent', () => {
  let component: MyMembershipsComponent;
  let fixture: ComponentFixture<MyMembershipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyMembershipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyMembershipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
