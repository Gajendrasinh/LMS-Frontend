import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamPaperCheckComponent } from './exam-paper-check.component';

describe('ExamPaperCheckComponent', () => {
  let component: ExamPaperCheckComponent;
  let fixture: ComponentFixture<ExamPaperCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamPaperCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamPaperCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
