import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WebinarListingComponent } from './webinar-listing.component';

describe('WebinarListingComponent', () => {
  let component: WebinarListingComponent;
  let fixture: ComponentFixture<WebinarListingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WebinarListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebinarListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
