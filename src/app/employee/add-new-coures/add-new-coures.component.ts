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
import { Editor, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-add-new-coures',
  templateUrl: './add-new-coures.component.html',
  styleUrls: ['./add-new-coures.component.scss'],
})
export class AddNewCouresComponent implements OnInit {
  public courseForm: FormGroup;

  isEdit: boolean = false;
  courseEditId: any = '';
  courImgName: any = '';
  courDocName: any = '';
  imageFile: any;
  documentFile: any;
  editor: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  chapters: any = [];

  categories: any = [];
  subCategories: any = [];

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    public httpService: HttpService,
    public activeRoute: ActivatedRoute,
    public modelService: NgbModal
  ) {}

  ngOnInit(): void {
    this.editor = new Editor();

    this.courseForm = this.formBuilder.group({
      courseName: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      courseDescription: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      price: new FormControl('', Validators.compose([Validators.required])),
      category: new FormControl(
        null,
        Validators.compose([Validators.required])
      ),
      subCategory: new FormControl(
        null,
        Validators.compose([Validators.required])
      ),
      discount: new FormControl(''),
      createdBy: new FormControl(''),
      logo: new FormControl(''),
      file: new FormControl(''),
      _id: new FormControl(''),
      courseCollege: new FormControl(''),
    });

    this.getCategory();

    // this.addChapter();

    if (this.router.url.startsWith('/employee/editCourse/')) {
      this.isEdit = true;
      this.activeRoute.params.subscribe((prm) => {
        this.courseEditId = prm['id'];
      });
      this.setEditFromVal();
    }
  }

  categorySel(val: any) {
    this.subCategories = val.subCategory;
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
    } else {
      this.addUpdateCourse(val);
      this.httpService.spinner.hide();
    }
  }

  addUpdateCourse(val: any) {
    this.httpService.spinner.show();

    let courseObj = {};
    let urlEndPoint = this.isEdit
      ? 'employee/course/' + val._id
      : 'employee/course/add';
    courseObj['name'] = val.courseName ? val.courseName : '';
    courseObj['description'] = val.courseDescription
      ? val.courseDescription
      : '';
    courseObj['logo'] = val.logo ? val.logo : '';
    courseObj['file'] = val.logo ? val.logo : '';
    courseObj['college'] =
      this.httpService.userRole == 'college'
        ? this.httpService.userDetail._id
        : this.httpService.userDetail?.college?._id;

    courseObj['category'] = val.category ? val.category._id : '';
    courseObj['subCategory'] = val.category ? val.subCategory : '';
    courseObj['price'] = val.price ? val.price : 0;
    courseObj['discount'] = val.discount ? val.discount : 0;
    courseObj['createdBy'] = val.createdBy ? val.createdBy : '';

    let _tempChapter: any = [];

    if (this.chapters.length > 0) {
      this.chapters.forEach((chap: any, index: any) => {
        _tempChapter.push({
          title: val['chapterName_' + chap.chapter]
            ? val['chapterName_' + chap.chapter]
            : '',
          description: val['chapterDescription_' + chap.chapter]
            ? val['chapterDescription_' + chap.chapter]
            : '',
        });
      });
    } else {
      _tempChapter = [];
    }

    courseObj['chapters'] = _tempChapter;

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
        .get('courseDescription')
        .patchValue(this.httpService.tempCourseEditDetail?.description);
      this.courseForm
        .get('_id')
        .patchValue(this.httpService.tempCourseEditDetail?._id);
      this.courseForm
        .get('logo')
        .patchValue(this.httpService.tempCourseEditDetail?.college?.logo);
      this.courseForm
        .get('file')
        .patchValue(this.httpService.tempCourseEditDetail?.college?.file);
      this.courseForm
        .get('courseCollege')
        .patchValue(this.httpService.tempCourseEditDetail?.college);

      this.courImgName = this.httpService.tempCourseEditDetail?.logo
        ? this.httpService.tempCourseEditDetail?.logo
        : '';
      this.courDocName = this.httpService.tempCourseEditDetail?.file
        ? this.httpService.tempCourseEditDetail?.file
        : '';

      this.courseForm
        .get('category')
        .patchValue(this.httpService.tempCourseEditDetail?.category);
      this.courseForm
        .get('subCategory')
        .patchValue(this.httpService.tempCourseEditDetail?.subCategory);

      this.courseForm
        .get('price')
        .patchValue(this.httpService.tempCourseEditDetail?.price);

      this.courseForm
        .get('discount')
        .patchValue(this.httpService.tempCourseEditDetail?.discount);

      this.courseForm
        .get('createdBy')
        .patchValue(this.httpService.tempCourseEditDetail?.createdBy);
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
        this.router.navigateByUrl('employee/courses/by-categories');
    });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  addChapter() {
    let _index = this.chapters.length + 1;

    this.courseForm.addControl('chapterName_' + _index, new FormControl());
    this.courseForm.addControl(
      'chapterDescription_' + _index,
      new FormControl()
    );

    this.chapters.push({
      chapter: _index,
      editor: new Editor(),
    });
  }

  getCategory() {
    this.httpService.spinner.show();
    this.httpService
      .httpRequest('admin/category/list', '', 'get', false, true)
      .subscribe((resp) => {
        if (resp.status == 'success' && resp.responseCode == '200') {
          this.categories = resp.data.list;
        } else {
          this.categories = [];
        }
        this.httpService.spinner.hide();
      });
  }
}
