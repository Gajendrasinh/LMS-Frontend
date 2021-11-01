import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonAlertComponent } from 'src/app/common/common-alert/common-alert.component';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.scss']
})
export class AddStaffComponent implements OnInit {

  public staffForm: FormGroup;

  collageList: any[] = [];
  courseList: any[] = [];
  departMentList: any[] = [];

  isEdit: boolean = false;
  staffEditId: any = "";
  profileImg: any = '';
  profileImageFile: any;

  constructor(public formBuilder: FormBuilder,
    private router: Router, public httpService: HttpService, public activeRoute: ActivatedRoute, public modelService: NgbModal) { }

  ngOnInit(): void {

    this.staffForm = this.formBuilder.group({
      firstname: new FormControl("", Validators.compose([Validators.required])),
      lastname: new FormControl("", Validators.compose([Validators.required])),
      email: new FormControl("", Validators.compose([Validators.required])),
      college: new FormControl("", Validators.compose([Validators.required])),
      dob: new FormControl("", Validators.compose([Validators.required])),
      dateofjoining: new FormControl("", Validators.compose([Validators.required])),
      department: new FormControl("", Validators.compose([Validators.required])),
      coursename: new FormControl("", Validators.compose([Validators.required])),
      phone: new FormControl("", Validators.compose([Validators.required])),
      address: new FormControl(""),
      logo: new FormControl(""),
      _id: new FormControl("")
    });

    this.getCollageList();
    this.getCourseList();
    if (this.router.url.startsWith("/college/editStaff/")) {
      this.isEdit = true;
      this.activeRoute.params.subscribe(prm => { this.staffEditId = prm['id']; })
      this.setEditFromVal()
    }
  }

  fileSelectChange(event: any) {
    this.profileImg = event.target.files[0].name;
    this.profileImageFile = event.target.files[0];
  }

  uploadStaffProfile(file: any, val: any) {
    let urlEndPoint;
    let obj = new FormData();
    urlEndPoint = "upload/file?folder=images";
    obj.append("file", file, file.name);


    this.httpService.httpRequest(urlEndPoint, obj, "post", true, false).subscribe((resp) => {
      if (resp.status == "success" && resp.responseCode == "200") {
        this.staffForm.get('logo').patchValue(resp.data.path);
        val['logo'] = resp.data.path;
        this.addEditStaff(val);
      } else {
        this.httpService.spinner.hide();
      }
    })
  }

  addEditStaff(val) {
    let staffObj = {};
    let clgId = this.httpService.userRole == 'college' ? this.httpService.userDetail._id : this.httpService.userDetail?.college?._id;
    let urlEndPoint = this.isEdit ? "college/" + clgId + "/staff/" + this.staffEditId : "college/" + clgId + "/staff";

    staffObj['firstname'] = val.firstname ? val.firstname : '';
    staffObj['lastname'] = val.lastname ? val.lastname : '';
    staffObj['email'] = val.email ? val.email : '';
    staffObj['college'] = val.college ? val.college : '';
    staffObj['dob'] = val.dob ? val.dob : '';
    staffObj['logo'] = val.logo ? val.logo : '';
    staffObj['dateofjoining'] = val.dateofjoining ? val.dateofjoining : '';
    staffObj['department'] = val.department ? val.department : '';
    staffObj['coursename'] = val.coursename ? val.coursename : '';
    staffObj['phone'] = val.phone ? val.phone : '';
    staffObj['address'] = val.address ? val.address : '';
    staffObj['role'] = clgId;

    this.httpService.httpRequest(urlEndPoint, staffObj, this.isEdit ? "put" : "post", false, true).subscribe((resp) => {
      if (resp.status == "success" && resp.responseCode == "200") {
        this.router.navigateByUrl(this.httpService.userRole + '/staffListing');
      }
      this.httpService.spinner.hide();
    })
  }

  submitForm(val) {
    this.httpService.spinner.show();
    if (this.profileImageFile != undefined && this.profileImageFile != null) this.uploadStaffProfile(this.profileImageFile, val)
    else this.addEditStaff(val);
  }

  getCollageList() {
    this.httpService.spinner.show();
    this.httpService.httpRequest("college/list", "", "get", false, true).subscribe((resp) => {
      if (resp.status == "success" && resp.responseCode == "200") {
        this.collageList = resp.data?.college?.list;
        this.staffForm.get('college').patchValue(this.httpService.userDetail?._id);
        this.staffForm.get('college').disabled;
        this.getDepartMentList(this.collageList, this.staffForm.value)
      }
      this.httpService.spinner.hide();
    })
  }

  getCourseList() {
    this.httpService.spinner.show();
    this.httpService.httpRequest("college/courses", "", "get", false, true).subscribe((resp) => {
      if (resp.status == "success" && resp.responseCode == "200") {
        this.courseList = resp.data?.list;
      }
      this.httpService.spinner.hide();
    })
  }

  getDepartMentList(clgList: any, formVal: any) {
    this.departMentList = [];
    clgList.forEach(clg => {
      if (clg._id == formVal.college) this.departMentList = clg.department;
    });
  }

  setEditFromVal() {
    if (this.httpService.checkValNull(this.httpService.tempStaffEditDetail)) {
      this.alert("warning", "Edit Student Detail not Found", "editFrom");
    } else {
      this.getDepartMentList(this.collageList, this.httpService.tempStaffEditDetail?.college);
      this.staffForm.get("firstname").patchValue(this.httpService.tempStaffEditDetail?.firstname);
      this.staffForm.get("lastname").patchValue(this.httpService.tempStaffEditDetail?.lastname);
      this.staffForm.get("email").patchValue(this.httpService.tempStaffEditDetail?.email);
      this.staffForm.get("college").patchValue(this.httpService.tempStaffEditDetail.college);
      this.staffForm.get("dob").patchValue(this.httpService.tempStaffEditDetail.dob != undefined ? new Date(this.httpService.tempStaffEditDetail.dob) : '');
      this.staffForm.get("dateofjoining").patchValue(this.httpService.tempStaffEditDetail.dateofjoining != undefined ? new Date(this.httpService.tempStaffEditDetail.dateofjoining) : '');
      this.staffForm.get("department").patchValue(this.httpService.tempStaffEditDetail?.department);
      this.staffForm.get("coursename").patchValue(this.httpService.tempStaffEditDetail?.coursename);
      this.staffForm.get("phone").patchValue(this.httpService.tempStaffEditDetail?.phone);
      this.staffForm.get("address").patchValue(this.httpService.tempStaffEditDetail?.address);
      this.staffForm.get("_id").patchValue(this.httpService.tempStaffEditDetail?._id);
      this.staffForm.get("logo").patchValue(this.httpService.tempStaffEditDetail?.logo);

      this.profileImg = this.httpService.tempStaffEditDetail?.logo ? this.httpService.tempStaffEditDetail?.logo : '';
    }
  }

  alert(alertType: any, msg: any, callFrom: any,) {
    const initialState = {
      alertType: alertType,
      msg: msg,
      isBtnShowOK: true
    }

    const modalRef = this.modelService.open(CommonAlertComponent, { centered: true, backdrop: 'static', keyboard: false })
    modalRef.componentInstance.data = initialState;

    modalRef.result.then((result) => {
      if (result == "Y") this.router.navigateByUrl(this.httpService.userRole + "/staffListing");
    })
  }

  //college/6102e0d81701ec2b4007eaa5/staff
}
