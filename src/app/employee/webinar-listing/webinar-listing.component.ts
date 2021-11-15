import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-webinar-listing',
  templateUrl: './webinar-listing.component.html',
  styleUrls: ['./webinar-listing.component.scss'],
})
export class WebinarListingComponent implements OnInit {
  public webinarForm: FormGroup;
  clgId: any;
  webinarList: any[] = [];
  count: any[] = [];
  webInarflitter: any = 'ongoing';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private httpService: HttpService,
    public datepipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.clgId = this.httpService.userRole == 'college' ? this.httpService.userDetail._id : this.httpService.userDetail?.college?._id;
    this.webinarForm = this.formBuilder.group({
      webinarList: new FormControl('ongoing'),
    });
    if (
      this.httpService.accessToken == undefined ||
      this.httpService.accessToken == null
    ) {
      this.router.navigateByUrl('/login');
    } else {
      this.getWebinarList(this.webInarflitter);
    }
  }

  getWebinarList(val) {
    this.httpService.spinner.show();
    if(this.clgId != undefined && this.clgId != null){
      this.httpService.httpRequest('employee/webinar/' + this.clgId + '/list?status=' + val, '', 'get', false, true).subscribe((resp) => {
        if (resp.status == 'success' && resp.responseCode == '200') {
          this.webinarList = [];
          resp.data?.list?.list?.forEach((item) => {
            this.webinarList.push(item);
          });
        }
        this.httpService.spinner.hide();
      });
    }else{
      console.log("webinar clg id not found");
    }
  }

  joinMeeting(url: any, pass: any) {
    window.open(url, '_blank');
  }
}
