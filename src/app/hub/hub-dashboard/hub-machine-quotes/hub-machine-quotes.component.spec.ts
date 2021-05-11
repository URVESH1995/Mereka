import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HubMachineQuotesComponent } from './hub-machine-quotes.component';

describe('HubMachineQuotesComponent', () => {
  let component: HubMachineQuotesComponent;
  let fixture: ComponentFixture<HubMachineQuotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HubMachineQuotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HubMachineQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
