import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseByCategoriesComponent } from './course-by-categories.component';

describe('CourseByCategoriesComponent', () => {
  let component: CourseByCategoriesComponent;
  let fixture: ComponentFixture<CourseByCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseByCategoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseByCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
