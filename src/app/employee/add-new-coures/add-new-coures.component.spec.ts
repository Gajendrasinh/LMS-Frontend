import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddNewCouresComponent } from './add-new-coures.component';

describe('AddNewCouresComponent', () => {
  let component: AddNewCouresComponent;
  let fixture: ComponentFixture<AddNewCouresComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewCouresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewCouresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
