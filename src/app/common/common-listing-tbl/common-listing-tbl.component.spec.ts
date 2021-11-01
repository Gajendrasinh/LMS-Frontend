import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonListingTblComponent } from './common-listing-tbl.component';

describe('CommonListingTblComponent', () => {
  let component: CommonListingTblComponent;
  let fixture: ComponentFixture<CommonListingTblComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonListingTblComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonListingTblComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
