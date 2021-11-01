import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonAlertComponent } from 'src/app/common/common-alert/common-alert.component';
import { HttpService } from 'src/app/service/http.service';
@Component({
  selector: 'app-exam-paper-check',
  templateUrl: './exam-paper-check.component.html',
  styleUrls: ['./exam-paper-check.component.scss']
})
export class ExamPaperCheckComponent implements OnInit {

  stdId: any = "";
  examId: any = ''
  index: number = 0;
  lastQueIndex: number = 0;
  isShow: boolean = false;

  question: any = ''
  answer: any = '';
  mark: any = '';
  totalMark: number = 0;

  constructor(public formBuilder: FormBuilder,
    private router: Router, public httpService: HttpService, public activeRoute: ActivatedRoute, public modelService: NgbModal) { }

  ngOnInit(): void {
    if (this.httpService.checkValNull(this.httpService.tempExamMarkingDetail)) {
      this.alert("warning", "Exam marking Detail not Found");
    } else {
      this.setVal();
    }
  }

  setVal() {
    if (this.httpService.tempExamMarkingDetail.answers != undefined && this.httpService.tempExamMarkingDetail.answers.length > 0) {
      this.examId = this.httpService.tempExamMarkingDetail?.examId;
      this.stdId = this.httpService.tempExamMarkingDetail?.studentId;
      if (this.httpService.tempExamMarkingDetail.answers[this.index] != undefined) {
        this.question = this.httpService.tempExamMarkingDetail.answers[this.index]?.text;
        this.answer = this.httpService.tempExamMarkingDetail.answers[this.index]?.answer;
      }
      this.isShow = true;
      this.lastQueIndex = this.httpService.tempExamMarkingDetail.answers.length;
    }
  }

  alert(alertType: any, msg: any, next?: any) {
    const initialState = {
      alertType: alertType,
      msg: msg,
      isBtnShowOK: true
    }

    const modalRef = this.modelService.open(CommonAlertComponent, { centered: true, backdrop: 'static', keyboard: false })
    modalRef.componentInstance.data = initialState;

    modalRef.result.then((result) => {
      if (result == "Y" && next == undefined) this.router.navigateByUrl(this.httpService.userRole + "/examCheck");
    })
  }

  submitForm() {
    if (this.mark != null && this.mark != undefined && this.mark != '') {
      let obj = {};
      let urlEndPoint = 'employee/student/exam/marks/' + this.stdId;

      obj['examId'] = this.examId;
      obj['marks'] = this.totalMark;

      this.httpService.httpRequest(urlEndPoint, obj, "post", false, true).subscribe((resp) => {
        if (resp.status == "success" && resp.responseCode == "200") {
          this.httpService.showToastMsgHandler("info", resp.data?.message)
          this.router.navigateByUrl(this.httpService.userRole + '/examCheck');
        }
        this.httpService.spinner.hide();
      })
    } else {
      this.alert("warning", "Please Provide Mark", 'submit');
    }
  }

  markChange(event: any) {
    this.mark = event.target.value;
    this.totalMark = parseInt(this.mark) + this.totalMark;
  }

  nextQuestion() {
    if (this.mark != null && this.mark != undefined && this.mark != '') {
      this.index += 1;
      if (this.httpService.tempExamMarkingDetail.answers[this.index] != undefined) {
        this.question = this.httpService.tempExamMarkingDetail.answers[this.index]?.text;
        this.answer = this.httpService.tempExamMarkingDetail.answers[this.index]?.answer;
        this.mark = '';
      } else {
        this.alert("warning", "No Next Found", 'next');
      }
    } else {
      this.alert("warning", "Please Provide Mark", 'next');
    }
  }

}
