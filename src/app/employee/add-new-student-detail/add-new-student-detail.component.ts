import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonAlertComponent } from 'src/app/common/common-alert/common-alert.component';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-add-new-student-detail',
  templateUrl: './add-new-student-detail.component.html',
  styleUrls: ['./add-new-student-detail.component.scss']
})
export class AddNewStudentDetailComponent implements OnInit {

  public studentForm: FormGroup;

  collageList: any[] = [];
  departMentList: any[] = [];

  isEdit: boolean = false;
  stdEditId: any = "";

  stdProfile:any='';
  stdProfileFile:any;

  constructor(public formBuilder: FormBuilder,
    private router: Router, public httpService: HttpService, public activeRoute: ActivatedRoute, public modelService: NgbModal) { }

  ngOnInit(): void {

    this.studentForm = this.formBuilder.group({
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

    if (this.router.url.startsWith("/employee/editStudent/")) {
      this.isEdit = true;
      this.activeRoute.params.subscribe(prm => { this.stdEditId = prm['id']; })
      this.setEditFromVal()
    }
  }

  fileSelectChange(event: any) {
    this.stdProfile = event.target.files[0].name;
    this.stdProfileFile = event.target.files[0];
  }

  uploadStdProfile(file: any, val: any) {
    let urlEndPoint;
    let obj = new FormData();
    urlEndPoint = "upload/file?folder=images";
    obj.append("file", file, file.name);


    this.httpService.httpRequest(urlEndPoint, obj, "post", true, false).subscribe((resp) => {
      if (resp.status == "success" && resp.responseCode == "200") {
        this.studentForm.get('logo').patchValue(resp.data.path);
        val['logo'] = resp.data.path;
        this.addEditStudent(val);
      } else {
        this.httpService.spinner.hide();
      }
    })
  }

  addEditStudent(val:any){
    let stdObj = {};
    let urlEndPoint = this.isEdit ? "student/" + val._id : "employee/student/add";
  
    stdObj['firstname'] = val.firstname ? val.firstname : '';
    stdObj['lastname'] = val.lastname ? val.lastname : '';
    stdObj['email'] = val.email ? val.email : '';
    stdObj['college'] = val.college ? val.college : '';
    stdObj['dob'] = val.dob ? val.dob : '';
    stdObj['dateofjoining'] = val.dateofjoining ? val.dateofjoining : '';
    stdObj['department'] = val.department ? val.department : '';
    stdObj['coursename'] = val.coursename ? val.coursename : '';
    stdObj['phone'] = val.phone ? val.phone : '';
    stdObj['address'] = val.address ? val.address : '';
    stdObj['logo'] = val.logo ? val.logo : '';
  
    this.httpService.httpRequest(urlEndPoint, stdObj, this.isEdit ? "put" : "post", false, true).subscribe((resp) => {
      if (resp.status == "success" && resp.responseCode == "200") {
        this.router.navigateByUrl(this.httpService.userRole + '/studentListing');
      } 
      this.httpService.spinner.hide();
    })
  }

  submitForm(val) {
    this.httpService.spinner.show();
    if (this.stdProfileFile != undefined && this.stdProfileFile != null) this.uploadStdProfile(this.stdProfileFile, val)
    else this.addEditStudent(val);
  }

  getCollageList() {
    this.httpService.spinner.show();
    this.httpService.httpRequest("college/list", "", "get", false, false).subscribe((resp) => {
      if (resp.status == "success" && resp.responseCode == "200") this.collageList = resp.data?.college?.list;
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
    if (this.httpService.checkValNull(this.httpService.tempStdEditDetail)) {
      this.alert("warning", "Edit Student Detail not Found", "editFrom");
    } else {
      this.getDepartMentList(this.collageList, this.httpService.tempStdEditDetail?.college?._id);
      this.studentForm.get("firstname").patchValue(this.httpService.tempStdEditDetail?.firstname);
      this.studentForm.get("lastname").patchValue(this.httpService.tempStdEditDetail?.lastname);
      this.studentForm.get("email").patchValue(this.httpService.tempStdEditDetail?.email);
      this.studentForm.get("college").patchValue(this.httpService.tempStdEditDetail?.college?._id);
      this.studentForm.get("dob").patchValue(this.httpService.tempStdEditDetail?.dob);
      this.studentForm.get("dateofjoining").patchValue(this.httpService.tempStdEditDetail?.dateofjoining);
      this.studentForm.get("department").patchValue(this.httpService.tempStdEditDetail?.department);
      this.studentForm.get("coursename").patchValue(this.httpService.tempStdEditDetail?.coursename);
      this.studentForm.get("phone").patchValue(this.httpService.tempStdEditDetail?.phone);
      this.studentForm.get("address").patchValue(this.httpService.tempStdEditDetail?.address);
      this.studentForm.get("_id").patchValue(this.httpService.tempStdEditDetail?._id);
      this.studentForm.get("logo").patchValue(this.httpService.tempStdEditDetail?.logo);

      this.stdProfile = this.httpService.tempStdEditDetail?.logo ? this.httpService.tempStdEditDetail?.logo : '';
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
      if (result == "Y") this.router.navigateByUrl("employee/studentListing");
    })
  }

}
