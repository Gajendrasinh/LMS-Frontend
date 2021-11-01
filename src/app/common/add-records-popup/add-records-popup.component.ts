import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BulkUploadCsvService } from 'src/app/service/bulk-upload-csv.service';
import { HttpService } from 'src/app/service/http.service';
import { CommonAlertComponent } from '../common-alert/common-alert.component';

@Component({
  selector: 'app-add-records-popup',
  templateUrl: './add-records-popup.component.html',
  styleUrls: ['./add-records-popup.component.scss']
})
export class AddRecordsPopupComponent implements OnInit {

  data: any;

  isbulkUpload: boolean = false;
  isShowClgSelect: boolean = false;
  isExamBulk: boolean = false;

  selectedExamType: any = null;
  selectedCourse: any = null;

  csvFileName: any = '';
  csvFile: any = {};
  csvFileReadData: any = {};
  selectedClg: any = null;
  collageList: any[] = [];
  courseList: any = [] = [];

  public bulkUploadForm: FormGroup;

  constructor(public activeModal: NgbActiveModal, public bulckUploadSrv: BulkUploadCsvService, public httpService: HttpService, public modelService: NgbModal, public formBuilder: FormBuilder) { }

  ngOnInit(): void {
    if (this.data.title == 'Exam') {
      this.bulkUploadForm = this.formBuilder.group({
        examType: new FormControl(null, Validators.compose([Validators.required])),
        course: new FormControl(null, Validators.compose([Validators.required])),
        name: new FormControl("", Validators.compose([Validators.required])),
        attempts: new FormControl("", Validators.compose([Validators.required])),
        date: new FormControl("", Validators.compose([Validators.required])),
        time: new FormControl("", Validators.compose([Validators.required])),
      });
    }
  }

  uploadOperation(type: any) {
    if (type == 'bulk') {
      this.isbulkUpload = true;
      if (this.data.title == 'Student' || this.data.title == 'Employee' || this.data.title == 'Staff') {
        this.getCollageList();
        this.isShowClgSelect = true;
      } else if (this.data.title == 'Exam') {
        this.getCourseList();
        this.isExamBulk = true;
      }
    } else {
      this.isbulkUpload = false;
      this.activeModal.close({ type: type });
    }
  }

  fileChangeEvent(e: any) {
    this.csvFileName = e.target.files[0].name;
    this.csvFile = e.srcElement.files;
    this.csvRead(e);
  }

  bulckUpload(title: any) {
    if (this.csvFileReadData.arrObj != undefined && this.csvFileReadData.arrObj.length == 0) {
      this.alert("warning", this.csvFileReadData.msg, "");
    } else if ((this.data.title == 'Student' || this.data.title == 'Employee' || this.data.title == 'Staff') && this.selectedClg == null) {
      this.alert("warning", "Please Select Collage", "");
    } else {
      if (this.data.title == 'Student' || this.data.title == 'Employee' || this.data.title == 'Staff') {
        this.csvFileReadData.arrObj.forEach(item => {
          item['college'] = this.selectedClg;
        });
      } else if (this.data.title == 'Exam') {
        let finalExamObj: any = {};
        let frmVal = this.bulkUploadForm.value;
        let questionsList: any[] = []
        let totleMark: number = 0;
        this.csvFileReadData.arrObj.forEach(item => {
          totleMark = parseInt(item.marks) + totleMark;
          if (this.bulkUploadForm.get('examType').value != '' && this.bulkUploadForm.get('examType').value != undefined && this.bulkUploadForm.get('examType').value != null) {
            if (this.bulkUploadForm.get('examType').value == 'mcq') {
              questionsList.push({ question: item.question, marks: item.marks, answer: item.answer, options: [{ 1: item.option1 }, { 2: item.option2 }, { 3: item.option3 }, { 4: item.option4 }] })
            } else {
              questionsList.push({ question: item.question, marks: item.marks })
            }
          }
        });
        finalExamObj['course'] = frmVal?.course ? frmVal?.course : '';
        finalExamObj['name'] = frmVal?.name ? frmVal?.name : '';
        finalExamObj['attempts'] = frmVal?.attempts ? frmVal?.attempts : '';
        finalExamObj['date'] = frmVal?.date ? frmVal?.date : '';
        finalExamObj['time'] = frmVal?.time ? frmVal?.time : '';
        finalExamObj['total'] = totleMark;
        finalExamObj['examType'] = frmVal?.examType ? frmVal?.examType : '';
        finalExamObj['questions'] = questionsList;
        this.csvFileReadData.arrObj = [finalExamObj];
      }
      this.activeModal.close({ type: 'bulk', list: this.csvFileReadData, clg: this.selectedClg })
    }
  }

  ngOnDestroy() {
    this.data = null;
    this.isbulkUpload = false;
    this.csvFileName = '';
    this.csvFile = {};
  }

  csvRead(e: any) {
    let rs: any = {};
    let files = e.srcElement.files;

    if (this.bulckUploadSrv.isValidCSVFile(files[0])) {

      let input = e.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

        let headersRow = this.bulckUploadSrv.getHeaderArray(csvRecordsArray);
        let tempTitle;
        if (this.data.title == 'Exam') {
          if (this.bulkUploadForm.get('examType').value != '' && this.bulkUploadForm.get('examType').value != undefined && this.bulkUploadForm.get('examType').value != null) {
            tempTitle = this.bulkUploadForm.get('examType').value;
          } else {
            this.csvFileReadData = { msg: "Please provider valid csv", arrObj: [] }
          }
        } else tempTitle = this.data.title;

        if (tempTitle != undefined) {
          this.csvFileReadData = this.bulckUploadSrv.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length, tempTitle);
        }
      };

      reader.onerror = function () {
        console.log("error to read");
      };

    } else {
      this.csvFileReadData = { msg: "Please provider valid csv", arrObj: [] }
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
    })
  }

  getCollageList() {
    this.httpService.spinner.show();
    this.httpService.httpRequest("college/list", "", "get", false, true).subscribe((resp) => {
      if (resp.status == "success" && resp.responseCode == "200") {
        this.collageList = resp.data?.college?.list;
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

}
