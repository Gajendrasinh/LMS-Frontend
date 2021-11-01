import { Component } from '@angular/core';
import { HttpService } from './service/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'LMS';

  constructor(public httpService: HttpService, private router: Router) {
  }

  ngOnInit() {
    if (this.httpService.checkValNull(this.httpService.accessToken)) {
      this.httpService.accessToken = this.httpService.getToken("accessToken");
      this.httpService.userDetail = this.httpService.getToken("userDetail");
      if (this.httpService.checkValeNotNull(this.httpService.accessToken)) {
        this.setTokenUserDetail()
      } else {
        this.httpService.setTokenNull();
        this.router.navigateByUrl("login");
      }
    }
  }

  setTokenUserDetail() {
    this.httpService.accessToken = this.httpService.getToken("accessToken");
    this.httpService.userDetail = this.httpService.getToken("userDetail");
    this.httpService.isShowMenu = true;
    if (this.httpService.userDetail.role != undefined && this.httpService.userDetail.role != '') {
      if (this.httpService.userDetail.role.name != undefined) this.httpService.userRole = this.httpService.userDetail?.role.name;
      else this.httpService.userRole = this.httpService.userDetail.role;
    }
    this.httpService.isChangeLoginEmit.emit(this.httpService.userDetail);
  }

}
