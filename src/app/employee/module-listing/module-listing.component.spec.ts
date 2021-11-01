import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleListingComponent } from './module-listing.component';

describe('ModuleListingComponent', () => {
  let component: ModuleListingComponent;
  let fixture: ComponentFixture<ModuleListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
