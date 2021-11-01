import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorAddCourseComponent } from './tutor-add-course.component';

describe('TutorAddCourseComponent', () => {
  let component: TutorAddCourseComponent;
  let fixture: ComponentFixture<TutorAddCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorAddCourseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorAddCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
