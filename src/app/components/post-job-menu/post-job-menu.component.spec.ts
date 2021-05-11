import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostJobMenuComponent } from './post-job-menu.component';

describe('PostJobMenuComponent', () => {
  let component: PostJobMenuComponent;
  let fixture: ComponentFixture<PostJobMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostJobMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostJobMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
