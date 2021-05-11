import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostJobStep3Component } from './post-job-step3.component';

describe('PostJobStep3Component', () => {
  let component: PostJobStep3Component;
  let fixture: ComponentFixture<PostJobStep3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostJobStep3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostJobStep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
