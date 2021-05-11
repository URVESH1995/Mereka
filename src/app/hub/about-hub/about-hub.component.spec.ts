import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutHubComponent } from './about-hub.component';

describe('AboutHubComponent', () => {
  let component: AboutHubComponent;
  let fixture: ComponentFixture<AboutHubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutHubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
