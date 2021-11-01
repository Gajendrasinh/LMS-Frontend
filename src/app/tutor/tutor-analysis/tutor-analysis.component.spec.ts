import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorAnalysisComponent } from './tutor-analysis.component';

describe('TutorAnalysisComponent', () => {
  let component: TutorAnalysisComponent;
  let fixture: ComponentFixture<TutorAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
