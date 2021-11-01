import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Editor } from 'ngx-editor';
import { CommonAlertComponent } from 'src/app/common/common-alert/common-alert.component';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-exam-paper',
  templateUrl: './exam-paper.component.html',
  styleUrls: ['./exam-paper.component.scss'],
})
export class ExamPaperComponent implements OnInit {
  editor: Editor;
  html: '';
  essayValue: string = '';
  codeValue: string = '';
  examId = '';
  questionPaper: any = null;
  totalQuestionsLength = 0;
  questionsArray: any = [];
  currentQuestion = 0;
  optionTags: any = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  selectedOptions: any = [];
  isStartExam: boolean = false;

  constructor(
    private router: Router,
    private httpService: HttpService,
    private activatedRoute: ActivatedRoute,
    public modelService: NgbModal
  ) {
    this.activatedRoute.params.subscribe((param) => {
      this.examId = param.id;
    });
  }

  ngOnInit(): void {
    // this.getQuestionPaper(this.examId);
    this.editor = new Editor();
  }

  async getQuestionPaper(id: String) {
    this.httpService.spinner.show();
    const url = `student/exam-paper/${id}`;
    this.httpService
      .httpRequest(url, '', 'get', false, true)
      .subscribe((resp) => {
        if (resp.status === 'success' && resp.responseCode === 200) {
          this.questionPaper = resp.data.questionPaper;
          this.totalQuestionsLength = this.questionPaper.questions.length;
          this.questionsArray = this.questionPaper.questions;
        }
        this.httpService.spinner.hide();
      });
  }

  handleSelectOption(e: any, option: string, index: any | number) {
    if (e.target.checked) {
      const tempSelectedOption: any = {};
      tempSelectedOption.answer = option;
      tempSelectedOption.question =
        this.questionsArray[this.currentQuestion]._id;
      tempSelectedOption.text =
        this.questionsArray[this.currentQuestion].question;
      this.selectedOptions[this.currentQuestion] = tempSelectedOption;
    } else {
      const tempSelectedOption: any = {};
      tempSelectedOption.answer = null;
      tempSelectedOption.question =
        this.questionsArray[this.currentQuestion]._id;
      tempSelectedOption.text =
        this.questionsArray[this.currentQuestion].question;
      this.selectedOptions[this.currentQuestion] = tempSelectedOption;
    }
  }

  handleNextQuestion() {
    if ( this.questionPaper.examType != 'essay' && this.questionPaper.examType != 'code' ) {
      if (this.selectedOptions[this.currentQuestion] == undefined) {
        this.alert('warning', 'Please select answer to process next question');
      } else if ( this.selectedOptions[this.currentQuestion].answer == undefined || this.selectedOptions[this.currentQuestion].answer == null ) {
        this.alert('warning', 'Please select answer to process next question');
      } else if (this.selectedOptions[this.currentQuestion] != undefined) {
        if (this.currentQuestion < this.totalQuestionsLength - 1) {
          this.currentQuestion += 1;
        }
      }
    } else {
      if (this.questionPaper.examType === 'essay' && this.essayValue == '') {
        this.alert('warning', 'Please select answer to process next question');
      } else if (this.questionPaper.examType === 'code' && this.codeValue == '' ) {
        this.alert('warning', 'Please select answer to process next question');
      } else {
        const tempSelectedOption: any = {};
        tempSelectedOption.answer = this.questionPaper.examType === 'code' ? this.codeValue : this.essayValue;
        tempSelectedOption.question = this.questionsArray[this.currentQuestion]._id;
        tempSelectedOption.text = this.questionsArray[this.currentQuestion].question;
        this.selectedOptions[this.currentQuestion] = tempSelectedOption;

        if (this.currentQuestion < this.totalQuestionsLength - 1) {
          this.currentQuestion += 1;
          this.essayValue = '';
          this.codeValue = '';
        }
      }
    }
  }

  handleSkipQuestion() {
    const tempSelectedOption: any = {};
    tempSelectedOption.answer = null;
    tempSelectedOption.question = this.questionsArray[this.currentQuestion]._id;
    this.selectedOptions[this.currentQuestion] = tempSelectedOption;
    if (this.currentQuestion < this.totalQuestionsLength - 1) {
      this.currentQuestion += 1;
    }
  }

  // handleSaveAnswer(type: any) {
  //   if (type == 'code') {
  //     const tempSelectedOption: any = {};
  //     tempSelectedOption.answer = this.codeValue;
  //     tempSelectedOption.question = this.questionsArray[this.currentQuestion]._id;
  //     this.selectedOptions[this.currentQuestion] = tempSelectedOption;
  //     this.codeValue = '';
  //   } else if (type == 'essay') {
  //     const tempSelectedOption: any = {};
  //     tempSelectedOption.answer = this.essayValue;
  //     tempSelectedOption.question = this.questionsArray[this.currentQuestion]._id;
  //     this.selectedOptions[this.currentQuestion] = tempSelectedOption;
  //     this.essayValue = '';
  //   }
  // }

  submitTestConfirm() {
    if (this.selectedOptions[this.currentQuestion] == undefined) {
      const tempSelectedOption: any = {};
      if(this.questionPaper.examType === 'code' || this.questionPaper.examType === 'essay'){
        tempSelectedOption.answer = this.questionPaper.examType === 'code' ? this.codeValue : this.essayValue;
        tempSelectedOption.question = this.questionsArray[this.currentQuestion]._id;
        tempSelectedOption.text = this.questionsArray[this.currentQuestion].text;
        this.selectedOptions[this.currentQuestion] = tempSelectedOption;
      }
    }
    this.alert(
      'warning',
      'Are you sure ! you want to submit exam',
      'examConfirmAlert'
    );
  }

  submitTest() {
    this.httpService.spinner.show();
    const body: any = {
      answers: this.selectedOptions,
    };
    const url = `student/exam-paper/${this.examId}`;
    this.httpService
      .httpRequest(url, body, 'post', false, true)
      .subscribe((resp) => {
        if (resp.status === 'success' && resp.responseCode === 200) {
          this.alert('success', resp.data.message, 'exam');
        }
        this.httpService.spinner.hide();
      });
  }

  handleEssay(event: any, type: any) {
    if (type == 'essay') this.essayValue = event.target.value;
    else if (type == 'code') this.codeValue = event.target.value;
  }

  alert(alertType: any, msg: any, callfrom?: any) {
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
      if (
        callfrom != undefined &&
        callfrom == 'examConfirmAlert' &&
        result == 'Y'
      ) {
        // console.log("this.selectedOptions", this.selectedOptions);
        this.submitTest();
      } else if (callfrom != undefined && callfrom == 'exam' && result == 'Y') {
        this.router.navigateByUrl('student/upCommingTest');
      }
    });
  }

  contactUsAlert() {
    const initialState = {
      alertType: 'info',
      msg: 'Are you sure you want discard this exam and go to contact us page',
      isBtnShowOK: false,
    };

    const modalRef = this.modelService.open(CommonAlertComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.data = initialState;

    modalRef.result.then((result) => {
      if (result == 'Y') this.router.navigateByUrl('student/contactus');
    });
  }

  examStartCancel(type: any) {
    if (type == 'start') {
      this.isStartExam = true;
      this.getQuestionPaper(this.examId);
    } else if (type == 'cancel') {
      this.router.navigateByUrl(this.httpService.userRole + '/upCommingTest');
    }
  }
}
