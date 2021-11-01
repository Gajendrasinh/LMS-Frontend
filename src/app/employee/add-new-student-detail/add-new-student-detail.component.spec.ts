import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddNewStudentDetailComponent } from './add-new-student-detail.component';

describe('AddNewStudentDetailComponent', () => {
  let component: AddNewStudentDetailComponent;
  let fixture: ComponentFixture<AddNewStudentDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewStudentDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewStudentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
