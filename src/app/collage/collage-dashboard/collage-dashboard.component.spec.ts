import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollageDashboardComponent } from './collage-dashboard.component';

describe('CollageDashboardComponent', () => {
  let component: CollageDashboardComponent;
  let fixture: ComponentFixture<CollageDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollageDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollageDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
