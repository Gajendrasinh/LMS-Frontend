import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPermissionListingComponent } from './user-permission-listing.component';

describe('UserPermissionListingComponent', () => {
  let component: UserPermissionListingComponent;
  let fixture: ComponentFixture<UserPermissionListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPermissionListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPermissionListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
