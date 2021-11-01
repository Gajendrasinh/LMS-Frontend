import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '../service/http.service';
import { ForgetPasswordPopupComponent } from './forget-password-popup/forget-password-popup.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  isLoginErr: any = "";
  loginUrl: any;

  logoUrl: string = '../../assets/img/LMS-logo.png';

  constructor(public formBuilder: FormBuilder,
    private router: Router, private httpService: HttpService, public modelService: NgbModal
  ) { }

  ngOnInit(): void {
    this.httpService.setTokenNull();
    window.localStorage.clear();
    this.loginForm = this.formBuilder.group({
      username: new FormControl(
        "",
        Validators.compose([
          Validators.required
        ])
      ),
      password: new FormControl("", Validators.required),
      role: new FormControl("", Validators.required),
    });

    if (this.router.url.startsWith('/collage/login')) this.loginUrl = "college/login";
    else this.loginUrl = "user/login";
  }

  forgotPassword() {
    const initialState = { }

    const modalRef = this.modelService.open(ForgetPasswordPopupComponent, { centered: true, backdrop: 'static', keyboard: false })
    modalRef.componentInstance.data = initialState;

    modalRef.result.then((result) => {
      if (result != null && result != undefined && result != '') {

      }
    })
  }

  signIn(val) {
    this.httpService.spinner.show();

    let loginReq = {};
    loginReq['email'] = val.username;
    loginReq['password'] = val.password;

    if (val.role == 'college') this.loginUrl = 'college/login';
    else if (val.role == 'student') this.loginUrl = 'student/login';
    else this.loginUrl == 'user/login';

    this.httpService.httpRequest(this.loginUrl, loginReq, "post", false, false).subscribe((resp) => {
      if (resp.status == "success" && resp.responseCode == "200") {
        this.httpService.accessToken = resp.data.token;

        this.httpService.setLocalVal("accessToken", this.httpService.accessToken)
        this.getUserDetail(resp.data?.user._id, val);
      } else {
        this.isLoginErr = resp.message;
      }
      this.httpService.spinner.hide();
    })
  }

  getUserDetail(id: any, val?: any) {
    this.httpService.spinner.show();
    let url: any = '';
    if (val.role == 'college') url = 'college/';
    else if (val.role == 'student') url = 'student/';
    else url = 'user/';

    this.httpService.httpRequest(url + id, "", "get", false, true).subscribe((resp) => {
      if (resp.data.user != undefined && resp.data.user != "") {

        this.httpService.userDetail = resp.data?.user;
        if (this.httpService.userDetail.role != undefined && this.httpService.userDetail.role != '') {
          if (this.httpService.userDetail.role.name != undefined) this.httpService.userRole = this.httpService.userDetail?.role.name;
          else this.httpService.userRole = this.httpService.userDetail.role;
        }

        this.httpService.setLocalVal("userDetail", this.httpService.userDetail)
        this.httpService.isShowMenu = true;
        this.httpService.isChangeLoginEmit.emit(this.httpService.userDetail);
        if (this.httpService.userRole != undefined) {
          if (this.httpService.userRole == "employee") {
            this.router.navigateByUrl('/employee/dashboard');
          } else if (this.httpService.userRole == "admin") {
            this.router.navigateByUrl('/admin/dashboard');
          } else if (this.httpService.userRole == "college") {
            this.router.navigateByUrl('/college/dashboard');
          } else if (this.httpService.userRole == "staff") {
            this.router.navigateByUrl('/staff/dashboard');
          } else if (this.httpService.userRole == "student") {
            this.router.navigateByUrl('/student/dashboard');
          }
        }
      }
      this.httpService.spinner.hide();
    })
  }

}
