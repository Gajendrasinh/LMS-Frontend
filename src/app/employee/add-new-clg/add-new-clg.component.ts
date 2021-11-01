import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonAlertComponent } from 'src/app/common/common-alert/common-alert.component';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-add-new-clg',
  templateUrl: './add-new-clg.component.html',
  styleUrls: ['./add-new-clg.component.scss']
})
export class AddNewClgComponent implements OnInit {

  public collageForm: FormGroup;

  isEdit: boolean = false;
  clgEditId: any = "";

  clgLogo:any='';
  clgLogoFile:any;

  departmentList: any[] = [];

  constructor(public formBuilder: FormBuilder,
    private router: Router, public httpService: HttpService, public activeRoute: ActivatedRoute, public modelService: NgbModal) { }

  ngOnInit(): void {
    this.collageForm = this.formBuilder.group({
      name: new FormControl("", Validators.compose([Validators.required])),
      email: new FormControl("", Validators.compose([Validators.required])),
      logo: new FormControl(""),
      phone: new FormControl("", Validators.compose([Validators.required])),
      address: new FormControl("", Validators.compose([Validators.required])),
      noofstaffs: new FormControl("", Validators.compose([Validators.required])),
      department: new FormControl("", Validators.compose([Validators.required])),
      _id: new FormControl("")
    });

    this.getDepartment();

    if (this.router.url.startsWith("/employee/editCollage/") || this.router.url.startsWith("/admin/editCollage/")) {
      this.isEdit = true;
      this.activeRoute.params.subscribe(prm => { this.clgEditId = prm['id']; })
      this.setEditFromVal()
    }
  }

  fileSelectChange(event: any) {
    this.clgLogo = event.target.files[0].name;
    this.clgLogoFile = event.target.files[0];
  }

  uploadClgLogoProfile(file: any, val: any) {
    let urlEndPoint;
    let obj = new FormData();
    urlEndPoint = "upload/file?folder=images";
    obj.append("file", file, file.name);


    this.httpService.httpRequest(urlEndPoint, obj, "post", true, false).subscribe((resp) => {
      if (resp.status == "success" && resp.responseCode == "200") {
        this.collageForm.get('logo').patchValue(resp.data.path);
        val['logo'] = resp.data.path;
        this.addEditCollage(val);
      } else {
        this.httpService.spinner.hide();
      }
    })
  }

  addEditCollage(val:any){
    let clgObj = {};
    let urlEndPoint = this.isEdit ? "college/" + val._id : "college/add";

    clgObj['name'] = val.name ? val.name : '';
    clgObj['email'] = val.email ? val.email : '';
    clgObj['logo'] = val.logo ? val.logo : '';
    clgObj['phone'] = val.email ? val.email : '';
    clgObj['address'] = val.address ? val.address : '';
    clgObj['noofstaffs'] = val.noofstaffs ? val.noofstaffs : '';
    clgObj['department'] = val.department ? val.department : [];

    this.httpService.httpRequest(urlEndPoint, clgObj, this.isEdit ? "put" : "post", false, true).subscribe((resp) => {
      if (resp.status == "success" && resp.responseCode == "200") {
        this.router.navigateByUrl(this.httpService.userRole + '/collageListing');
      } 
      this.httpService.spinner.hide();
    })
  }

  submitcollage(val: any) {
    this.httpService.spinner.show();
    if (this.clgLogoFile != undefined && this.clgLogoFile != null) this.uploadClgLogoProfile(this.clgLogoFile, val)
    else this.addEditCollage(val);
  }

  setEditFromVal() {
    if (this.httpService.checkValNull(this.httpService.tempClgEditDetail)) {
      this.alert("warning", "Edit Collage Detail not Found", "editFrom");
    } else {
      this.collageForm.get("name").patchValue(this.httpService.tempClgEditDetail?.name);
      this.collageForm.get("email").patchValue(this.httpService.tempClgEditDetail?.email);
      this.collageForm.get("logo").patchValue(this.httpService.tempClgEditDetail?.logo);
      this.collageForm.get("_id").patchValue(this.httpService.tempClgEditDetail?._id);
      this.collageForm.get("phone").patchValue(this.httpService.tempClgEditDetail?.phone);
      this.collageForm.get("address").patchValue(this.httpService.tempClgEditDetail?.address);
      this.collageForm.get("noofstaffs").patchValue(this.httpService.tempClgEditDetail?.noofstaffs);
      this.collageForm.get("department").patchValue(this.httpService.tempClgEditDetail?.department);

      this.clgLogo = this.httpService.tempClgEditDetail?.logo ? this.httpService.tempClgEditDetail?.logo : '';
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
      if (result == "Y") this.router.navigateByUrl(this.httpService.userRole + "/studentListing");
    })
  }

  getDepartment() {
    this.httpService.spinner.show();
    let clgId = this.httpService.userRole == 'college' ? this.httpService.userDetail._id : this.httpService.userDetail?.college?._id;
    let urlEndPoint = "college/" + clgId + "/departments"
    this.httpService.httpRequest(urlEndPoint, "", "get", false, true).subscribe((resp) => {
      if (resp.status == "success" && resp.responseCode == "200") this.departmentList = resp.data.departments;
      this.httpService.spinner.hide();
    })
  }

}
