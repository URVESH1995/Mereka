import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerekaProComponent } from './mereka-pro.component';

describe('MerekaProComponent', () => {
  let component: MerekaProComponent;
  let fixture: ComponentFixture<MerekaProComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerekaProComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerekaProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
