import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertGeneralProfileComponent } from './expert-general-profile.component';

describe('ExpertGeneralProfileComponent', () => {
  let component: ExpertGeneralProfileComponent;
  let fixture: ComponentFixture<ExpertGeneralProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpertGeneralProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpertGeneralProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
