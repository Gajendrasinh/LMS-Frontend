import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-forget-password-popup',
  templateUrl: './forget-password-popup.component.html',
  styleUrls: ['./forget-password-popup.component.scss']
})
export class ForgetPasswordPopupComponent implements OnInit {
  public emailForm: FormGroup;

  constructor(public activeModal: NgbActiveModal, public formBuilder: FormBuilder,public httpService: HttpService) { }

  ngOnInit(): void {
    this.emailForm = this.formBuilder.group({
      email: new FormControl("", Validators.compose([Validators.required, , Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])),
    });
  }

  close(type: any) {
    this.activeModal.close(type);
  }

  sendMail(val: any) {
    // let fdObj = {};

    // fdObj['email'] = val.name ? val.name : '';

    // this.httpService.httpRequest("admin/feedback", fdObj, "post", false, true).subscribe((resp) => {
    //   if (resp.status == "success" && resp.responseCode == "200") {
    //   }
    //   this.httpService.spinner.hide();
    // })
  }

}
