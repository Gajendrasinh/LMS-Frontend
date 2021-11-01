import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddNewClgComponent } from './add-new-clg.component';

describe('AddNewClgComponent', () => {
  let component: AddNewClgComponent;
  let fixture: ComponentFixture<AddNewClgComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewClgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewClgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
