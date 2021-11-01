import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarnedBadgsCertificateComponent } from './earned-badgs-certificate.component';

describe('EarnedBadgsCertificateComponent', () => {
  let component: EarnedBadgsCertificateComponent;
  let fixture: ComponentFixture<EarnedBadgsCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EarnedBadgsCertificateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EarnedBadgsCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
