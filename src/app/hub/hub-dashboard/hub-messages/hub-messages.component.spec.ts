import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HubMessagesComponent } from './hub-messages.component';

describe('HubMessagesComponent', () => {
  let component: HubMessagesComponent;
  let fixture: ComponentFixture<HubMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HubMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HubMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
