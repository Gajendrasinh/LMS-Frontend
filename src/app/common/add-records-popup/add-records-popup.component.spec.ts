import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecordsPopupComponent } from './add-records-popup.component';

describe('AddRecordsPopupComponent', () => {
  let component: AddRecordsPopupComponent;
  let fixture: ComponentFixture<AddRecordsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRecordsPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRecordsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
