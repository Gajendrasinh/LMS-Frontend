import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateUserPermissionComponent } from './add-update-user-permission.component';

describe('AddUpdateUserPermissionComponent', () => {
  let component: AddUpdateUserPermissionComponent;
  let fixture: ComponentFixture<AddUpdateUserPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateUserPermissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateUserPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
