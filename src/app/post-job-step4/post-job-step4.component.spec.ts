import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostJobStep4Component } from './post-job-step4.component';

describe('PostJobStep4Component', () => {
  let component: PostJobStep4Component;
  let fixture: ComponentFixture<PostJobStep4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostJobStep4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostJobStep4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
