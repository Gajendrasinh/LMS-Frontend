import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-common-alert',
  templateUrl: './common-alert.component.html',
  styleUrls: ['./common-alert.component.scss']
})
export class CommonAlertComponent implements OnInit {

  data: any;
  alertType: any;
  msg: any;
  isBtnShowOK:boolean = false;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.alertType = this.data.alertType;
    this.msg = this.data.msg;
    this.isBtnShowOK = this.data.isBtnShowOK != null && this.data.isBtnShowOK != undefined ? this.data.isBtnShowOK : false;
  }

  close(type: any) {
    this.activeModal.close(type);
  }


}
