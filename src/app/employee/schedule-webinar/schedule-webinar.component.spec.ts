import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ScheduleWebinarComponent } from './schedule-webinar.component';

describe('ScheduleWebinarComponent', () => {
  let component: ScheduleWebinarComponent;
  let fixture: ComponentFixture<ScheduleWebinarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleWebinarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleWebinarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
