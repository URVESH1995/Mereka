import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HubMembersComponent } from './hub-members.component';

describe('HubMembersComponent', () => {
  let component: HubMembersComponent;
  let fixture: ComponentFixture<HubMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HubMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HubMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
