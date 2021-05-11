import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostJobStep2Component } from './post-job-step2.component';

describe('PostJobStep2Component', () => {
  let component: PostJobStep2Component;
  let fixture: ComponentFixture<PostJobStep2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostJobStep2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostJobStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
