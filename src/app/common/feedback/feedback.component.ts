import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {

  public feedbackFrm: FormGroup;
  title: any;

  constructor(public formBuilder: FormBuilder, private router: Router, public httpService: HttpService) { }

  ngOnInit(): void {
    if (this.router.url.startsWith("/" + this.httpService.userRole + "/contactus")) this.title = "Contact Us";
    else if (this.router.url.startsWith("/" + this.httpService.userRole + "/feedback")) this.title = "Feedback";

    this.feedbackFrm = this.formBuilder.group({
      name: new FormControl("", Validators.compose([Validators.required])),
      email: new FormControl("", Validators.compose([Validators.required, , Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])),
      comment: new FormControl("", Validators.compose([Validators.required])),
    });
  }

  submitFeedback(val: any) {
    let fdObj = {};

    fdObj['name'] = val.name ? val.name : '';
    fdObj['comment'] = val.comment ? val.comment : '';
    fdObj['email'] = val.email ? val.email : '';
    fdObj['type'] = this.title = "Contact Us" ? "contacUs" : "feedback";

    this.httpService.httpRequest("admin/feedback", fdObj, "post", false, true).subscribe((resp) => {
      if (resp.status == "success" && resp.responseCode == "200") {
        this.httpService.showToastMsgHandler("success", resp.data.message);
        if (this.title == "Contact Us") this.router.navigateByUrl(this.httpService.userRole + '/upCommingTest');
        else this.router.navigateByUrl(this.httpService.userRole + "/dashboard");
      }
      this.httpService.spinner.hide();
    })
  }

}
