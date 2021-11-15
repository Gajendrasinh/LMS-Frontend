import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '../service/http.service';

@Component({
  selector: 'app-video-watch-popup',
  templateUrl: './video-watch-popup.component.html',
  styleUrls: ['./video-watch-popup.component.scss']
})
export class VideoWatchPopupComponent implements OnInit {

  data: any;
  videoUrl: any;

  constructor(public activeModal: NgbActiveModal, public httpService: HttpService) { }

  ngOnInit(): void {
    if (this.data?.video != undefined && this.data?.video != '') {
      this.videoUrl = this.httpService.filePath + this.data?.video;
    }
  }

  close(type: any) {
    this.activeModal.close(type);
  }

}
