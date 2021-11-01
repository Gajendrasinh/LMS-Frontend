import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  @Input() userDetail: any;

  public userprofile: FormGroup;

  profileImgUrl: any = "";
  userName: any = "";
  isEdit: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router, public httpService: HttpService, public activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.userprofile = this.formBuilder.group({
      userName: new FormControl(""),
      firstname: new FormControl(""),
      lastname: new FormControl(""),
      dob: new FormControl(""),
      phone: new FormControl(""),
      logo: new FormControl(""),
      college: new FormControl(""),
      email: new FormControl(""),
      coursename: new FormControl(""),
      _id: new FormControl("")
    });

    if (this.router.url.startsWith("/" + this.httpService.userRole + "/editProfile")) {
      this.isEdit = true;
    } else {
      this.isEdit = false;
    }

    this.getUserDetail(this.userDetail._id);
  }

  submitForm(val: any) {
    this.httpService.spinner.show();

    let userObj = {};
    let urlEndPoint = this.httpService.userRole == 'student' ? 'student/' + val._id : "user/" + val._id;

    if (val.firstname != undefined && val.firstname != "") userObj['firstname'] = val.firstname;
    if (val.lastname != undefined && val.lastname != "") userObj['lastname'] = val.lastname;
    if (val.dob != undefined && val.dob != "") userObj['dob'] = new Date(val.dob);
    if (val.phone != undefined && val.phone != "") userObj['phone'] = val.phone;
    if (val.phone != undefined && val.phone != "") userObj['phone'] = val.phone;
    if (val.logo != undefined && val.logo != "") userObj['logo'] = val.logo;

    this.httpService.httpRequest(urlEndPoint, userObj, this.isEdit ? "put" : "post", false, true).subscribe((resp) => {
      if (resp.status == "success" && resp.responseCode == "200") {
        this.httpService.userDetail = resp.data?.user;
        if (this.httpService.userDetail.role != undefined && this.httpService.userDetail.role != '') {
          if (this.httpService.userDetail.role.name != undefined) this.httpService.userRole = this.httpService.userDetail?.role.name;
          else this.httpService.userRole = this.httpService.userDetail.role;
        }
        this.httpService.setLocalVal("userDetail", this.httpService.userDetail)
        this.router.navigateByUrl(this.httpService.userRole + '/profile');
      }
      this.httpService.spinner.hide();
    })
  }

  cancel() {
    this.router.navigateByUrl(this.httpService.userRole + "/profile");
  }

  uploadUserProfile(event: any, type: any) {
    this.httpService.spinner.show();
    let urlEndPoint;
    let obj = new FormData();
    urlEndPoint = "upload/file?folder=images";
    obj.append("file", event.target.files[0], event.target.files[0].name);

    this.httpService.httpRequest(urlEndPoint, obj, "post", true, false).subscribe((resp) => {
      if (resp.status == "success" && resp.responseCode == "200") {
        if (type == 'img') {
          this.userprofile.get('logo').patchValue(resp.data.path);
          this.profileImgUrl = this.httpService.filePath + resp.data.path;
          this.httpService.spinner.hide();
        }
      } else {
        this.httpService.spinner.hide();
      }
    })
  }

  deleteProileImg() {
    this.profileImgUrl = "../../assets/img/user1.png";
    this.userprofile.get('logo').patchValue("");
  }

  getUserDetail(id: any) {
    this.httpService.spinner.show();
    let url = this.httpService.userRole == 'student' ? "student/" + id : "user/" + id;
    this.httpService.httpRequest(url, "", "get", true, false).subscribe((resp) => {
      if (resp.data.user != undefined && resp.data.user != "") {
        let userDetail = resp.data.user;
        this.profileImgUrl = userDetail.logo != undefined && userDetail.logo != "" ? this.httpService.filePath + userDetail.logo : "../../assets/img/user1.png"
        this.userprofile.get('logo').patchValue(userDetail.logo != undefined ? userDetail.logo : "../../assets/img/user1.png");
        this.userprofile.get('dob').patchValue(userDetail?.dob != null ? userDetail?.dob : "");
        this.userprofile.get('_id').patchValue(userDetail._id != undefined ? userDetail._id : "");
        this.userprofile.get('phone').patchValue(userDetail?.phone != null ? userDetail?.phone : "");
        this.userprofile.get('email').patchValue(userDetail?.email != null ? userDetail?.email : "");
        this.userprofile.get('college').patchValue(userDetail?.college != null ? userDetail?.college?.name : "");
        this.userprofile.get('coursename').patchValue(userDetail?.coursename != null ? userDetail?.coursename : "");
        this.userprofile.get('firstname').patchValue(userDetail?.firstname != null ? userDetail?.firstname : "");
        this.userprofile.get('lastname').patchValue(userDetail?.lastname != null ? userDetail?.lastname : "");
        if (userDetail.name != undefined && userDetail.name != null)
          this.userprofile.get('userName').patchValue(userDetail.name);
        else
          this.userprofile.get('userName').patchValue(userDetail?.firstname + " " + userDetail?.lastname);

        if (this.isEdit)
          this.userprofile.get('dob').patchValue(userDetail?.dob != null && userDetail?.dob != "" ? new Date(userDetail?.dob) : "");
      }
      this.httpService.spinner.hide();
    })
  }

}
