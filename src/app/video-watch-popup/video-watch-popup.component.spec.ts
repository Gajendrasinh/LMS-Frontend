import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoWatchPopupComponent } from './video-watch-popup.component';

describe('VideoWatchPopupComponent', () => {
  let component: VideoWatchPopupComponent;
  let fixture: ComponentFixture<VideoWatchPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoWatchPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoWatchPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
