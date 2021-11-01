import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-earned-badgs-certificate',
  templateUrl: './earned-badgs-certificate.component.html',
  styleUrls: ['./earned-badgs-certificate.component.scss']
})
export class EarnedBadgsCertificateComponent implements OnInit {

  title: any;
  certificateList: any[] = [];

  constructor(public router: Router, public httpService: HttpService) { }

  ngOnInit(): void {
    if (this.router.url.startsWith("/student/earnedBadges")) {
      this.title = "Badges Earned";
    } else if (this.router.url.startsWith("/student/certificateEarned")) {
      this.title = "Certificate Earned";
    }
    this.getCertificate();
  }

  getCertificate() {
    let url;
    if (this.title == 'My course') url = "student/list/badges";
    else url = "student/list/badges";
    this.httpService.httpRequest(url, "", "get", false, true).subscribe((resp) => {
      if (resp.status == "success" && resp.responseCode == "200") {
        this.certificateList = resp.data.list;
      }
      this.httpService.spinner.hide();
    })
  }

  ngOnDestroy() {
    this.title = "";
    this.certificateList = [];
  }

}
