import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonAlertComponent } from 'src/app/common/common-alert/common-alert.component';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-tutor-add-course',
  templateUrl: './tutor-add-course.component.html',
  styleUrls: ['./tutor-add-course.component.scss'],
})
export class TutorAddCourseComponent implements OnInit {
  public courseForm: FormGroup;

  isEdit: boolean = false;
  courseEditId: any = '';
  courImgName: any = '';
  courDocName: any = '';
  imageFile: any;
  documentFile: any;

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    public httpService: HttpService,
    public activeRoute: ActivatedRoute,
    public modelService: NgbModal
  ) {}

  ngOnInit(): void {
    this.courseForm = this.formBuilder.group({
      courseName: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      description: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      logo: new FormControl(''),
      file: new FormControl(''),
      cost: new FormControl(''),
      category: new FormControl(''),
      duration: new FormControl(''),
      _id: new FormControl(''),
    });

    if (this.router.url.startsWith('/staff/editCourse/')) {
      this.isEdit = true;
      this.activeRoute.params.subscribe((prm) => {
        this.courseEditId = prm['id'];
      });
      this.setEditFromVal();
    }
  }

  fileSelectChange(event: any, type: any) {
    if (type == 'img') {
      this.courImgName = event.target.files[0].name;
      this.imageFile = event.target.files[0];
    } else if (type == 'file') {
      this.courDocName = event.target.files[0].name;
      this.documentFile = event.target.files[0];
    }
  }

  uploadCourseFile(type: any, file: any, val: any) {
    let urlEndPoint;
    let obj = new FormData();
    if (type == 'img') {
      urlEndPoint = 'upload/file?folder=images';
      obj.append('file', file, file.name);
    } else {
      urlEndPoint = 'upload/file?folder=documents';
      obj.append('file', file, file.name);
    }

    this.httpService
      .httpRequest(urlEndPoint, obj, 'post', true, false)
      .subscribe((resp) => {
        if (resp.status == 'success' && resp.responseCode == '200') {
          if (type == 'img') {
            this.courseForm.get('logo').patchValue(resp.data.path);
            val['logo'] = resp.data.path;
            if (this.documentFile != undefined && this.documentFile != '')
              this.uploadCourseFile('documents', this.documentFile, val);
          } else {
            this.courseForm.get('file').patchValue(resp.data.path);
            val['file'] = resp.data.path;
          }

          if (
            (type == 'img' && this.documentFile == undefined) ||
            type == 'documents'
          ) {
            this.addUpdateCourse(val);
          }
        } else {
          this.httpService.spinner.hide();
        }
      });
  }

  submitCourse(val: any) {
    this.httpService.spinner.show();
    if (this.imageFile != undefined && this.imageFile != null) {
      this.uploadCourseFile('img', this.imageFile, val);
    } else if (this.documentFile != undefined && this.documentFile != null) {
      this.uploadCourseFile('documents', this.documentFile, val);
    }
  }

  addUpdateCourse(val: any) {
    let courseObj = {};
    let urlEndPoint = this.isEdit
      ? 'tutor/tutorials/' + val._id
      : 'tutor/tutorial';
    courseObj['name'] = val.courseName ? val.courseName : '';
    courseObj['description'] = val.description ? val.description : '';
    courseObj['logo'] = val.logo ? val.logo : '';
    courseObj['file'] = val.file ? val.file : '';
    courseObj['cost'] = val.cost ? val.cost : '';
    courseObj['category'] = val.category ? val.category : '';
    courseObj['duration'] = val.duration ? val.duration : '';

    this.httpService
      .httpRequest(
        urlEndPoint,
        courseObj,
        this.isEdit ? 'put' : 'post',
        false,
        true
      )
      .subscribe((resp) => {
        if (resp.status == 'success' && resp.responseCode == '200') {
          this.router.navigateByUrl(
            this.httpService.userRole + '/courses/by-categories'
          );
        }
        this.httpService.spinner.hide();
      });
  }

  setEditFromVal() {
    if (this.httpService.checkValNull(this.httpService.tempCourseEditDetail)) {
      this.alert('warning', 'Edit Course Detail not Found', 'editFrom');
    } else {
      this.courseForm
        .get('courseName')
        .patchValue(this.httpService.tempCourseEditDetail?.name);
      this.courseForm
        .get('category')
        .patchValue(this.httpService.tempCourseEditDetail?.category);
      this.courseForm
        .get('_id')
        .patchValue(this.httpService.tempCourseEditDetail?._id);
      this.courseForm
        .get('logo')
        .patchValue(this.httpService.tempCourseEditDetail?.logo);
      this.courseForm
        .get('file')
        .patchValue(this.httpService.tempCourseEditDetail?.file);
      this.courseForm
        .get('description')
        .patchValue(this.httpService.tempCourseEditDetail?.description);
      this.courseForm
        .get('duration')
        .patchValue(this.httpService.tempCourseEditDetail?.duration);
      this.courseForm
        .get('cost')
        .patchValue(this.httpService.tempCourseEditDetail?.cost);

      this.courImgName = this.httpService.tempCourseEditDetail?.logo
        ? this.httpService.tempCourseEditDetail?.logo
        : '';
      this.courDocName = this.httpService.tempCourseEditDetail?.file
        ? this.httpService.tempCourseEditDetail?.file
        : '';
    }
  }

  alert(alertType: any, msg: any, callFrom: any) {
    const initialState = {
      alertType: alertType,
      msg: msg,
      isBtnShowOK: true,
    };

    const modalRef = this.modelService.open(CommonAlertComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.data = initialState;

    modalRef.result.then((result) => {
      if (result == 'Y')
        this.router.navigateByUrl('staff/courses/by-categories');
    });
  }
}
