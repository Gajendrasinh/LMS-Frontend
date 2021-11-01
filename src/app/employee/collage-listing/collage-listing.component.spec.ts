import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollageListingComponent } from './collage-listing.component';

describe('CollageListingComponent', () => {
  let component: CollageListingComponent;
  let fixture: ComponentFixture<CollageListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollageListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollageListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
