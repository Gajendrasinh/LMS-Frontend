import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeListingComponent } from './employe-listing.component';

describe('EmployeListingComponent', () => {
  let component: EmployeListingComponent;
  let fixture: ComponentFixture<EmployeListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
