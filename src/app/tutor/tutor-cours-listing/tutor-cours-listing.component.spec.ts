import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorCoursListingComponent } from './tutor-cours-listing.component';

describe('TutorCoursListingComponent', () => {
  let component: TutorCoursListingComponent;
  let fixture: ComponentFixture<TutorCoursListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorCoursListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorCoursListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
