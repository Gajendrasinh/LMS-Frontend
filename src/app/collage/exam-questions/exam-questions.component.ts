import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonAlertComponent } from 'src/app/common/common-alert/common-alert.component';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-exam-questions',
  templateUrl: './exam-questions.component.html',
  styleUrls: ['./exam-questions.component.scss']
})
export class ExamQuestionsComponent implements OnInit {

  public examDetailForm: FormGroup;

  courseList: any[] = [];
  mcqQueList: any[] = [];
  codeQueList: any[] = [];
  eassyQueList: any[] = [];

  mcqQueCount: number = 1;
  codeQueCount: number = 1;
  eassyQueCount: number = 1;

  examId: any = "";
  profileImg: any = '';
  isRead: boolean = false;
  isEdit: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router, public httpService: HttpService, public modelService: NgbModal, public activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.examDetailForm = this.formBuilder.group({
      examType: new FormControl("mcq", Validators.compose([Validators.required])),
      course: new FormControl(null, Validators.compose([Validators.required])),
      name: new FormControl("", Validators.compose([Validators.required])),
      attempts: new FormControl("", Validators.compose([Validators.required])),
      date: new FormControl("", Validators.compose([Validators.required])),
      time: new FormControl("", Validators.compose([Validators.required])),
      total: new FormControl("0", Validators.compose([Validators.required])),
      id: new FormControl(""),
    });

    this.getCourseList();
    if (this.router.url.startsWith("/" + this.httpService.userRole + "/viewExamQuestions")) {
      this.isRead = true;
      this.isEdit = false;
      this.activeRoute.params.subscribe(prm => { this.examId = prm['id']; })
      this.setReadData();
    } else if (this.router.url.startsWith("/" + this.httpService.userRole + "/editExamQuestions")) {
      this.isRead = false;
      this.isEdit = true;
      this.activeRoute.params.subscribe(prm => { this.examId = prm['id']; })
      this.setReadData();
    }
  }

  setExamType(val) {
    this.clearVal();
    this.examDetailForm.get('examType').patchValue(val);

    this.examDetailForm.get('course').patchValue(null);
    this.examDetailForm.get('name').patchValue("");
    this.examDetailForm.get('attempts').patchValue("");
    this.examDetailForm.get('date').patchValue(new Date());
    this.examDetailForm.get('time').patchValue("");
    this.examDetailForm.get('total').patchValue("0");
  }

  confirmSave(val: any) {
    let msgtxt: any = this.isEdit ? " edit " : " save ";
    const initialState = {
      alertType: "info",
      msg: "Are you Sure you want to" + msgtxt + "this exam?"
    }

    const modalRef = this.modelService.open(CommonAlertComponent, { centered: true, backdrop: 'static', keyboard: false })
    modalRef.componentInstance.data = initialState;

    modalRef.result.then((result) => {
      if (result == "Y") {
        this.submitExam(val);
      }
    })
  }

  submitExam(val: any) {

    let examObj = {};
    let clgId = this.httpService.userRole == 'college' ? this.httpService.userDetail._id : this.httpService.userDetail?.college?._id;
    let urlEndPoint = this.isEdit ? "college/" + clgId + "/exam/" + this.examId : "college/" + clgId + "/exam";

    examObj['course'] = val.course ? val.course : '';
    examObj['name'] = val.name ? val.name : '';
    examObj['attempts'] = val.attempts ? val.attempts : '';
    examObj['date'] = val.date ? val.date : '';
    examObj['time'] = val.time ? val.time : '';
    examObj['total'] = val.total ? val.total : '';
    examObj['examType'] = val.examType ? val.examType : '';

    let question: any = [];
    if (val.examType == 'mcq') {
      this.mcqQueList.forEach(item => {
        let obj = {};
        let optionArry: any[] = [];
        obj['question'] = val['mcqQues_' + item.que] != undefined ? val['mcqQues_' + item.que] : "";
        obj['answer'] = val['mcqQues_' + item.que + '_ans'] != undefined ? val['mcqQues_' + item.que + '_ans'] : "";
        obj['marks'] = val['mcqQues_' + item.que + '_mark'] != undefined ? val['mcqQues_' + item.que + '_mark'] : "";
        if (item.option != undefined && item.option.length > 0) {
          item.option.forEach(option => {
            let optionObj = {};
            optionObj[option.ansCount] = val['mcqQues_' + item.que + '_option_' + option.ansCount] != undefined && val['mcqQues_' + item.que + '_option_' + option.ansCount] != '' ? val['mcqQues_' + item.que + '_option_' + option.ansCount] : "";
            optionArry.push(optionObj);
          });
        }
        obj['options'] = optionArry;
        question.push(obj);
      });
    } else if (val.examType == 'essay') {
      this.eassyQueList.forEach(item => {
        let obj = {};
        let optionArry: any[] = [];
        obj['question'] = val['essayQues_' + item.que] != undefined ? val['essayQues_' + item.que] : "";
        obj['marks'] = val['essayQues_' + item.que + '_mark'] != undefined ? val['essayQues_' + item.que + '_mark'] : "";

        question.push(obj);
      });
    } else if (val.examType == 'code') {
      this.codeQueList.forEach(item => {
        let obj = {};
        let optionArry: any[] = [];
        obj['question'] = val['codeQues_' + item.que] != undefined ? val['codeQues_' + item.que] : "";
        obj['marks'] = val['codeQues_' + item.que + '_mark'] != undefined ? val['codeQues_' + item.que + '_mark'] : "";

        question.push(obj);
      });
    }
    examObj['questions'] = question;

    this.httpService.httpRequest(urlEndPoint, examObj, this.isEdit ? "put" : "post", false, true).subscribe((resp) => {
      if (resp.status == "success" && resp.responseCode == "200") {
        this.router.navigateByUrl(this.httpService.userRole + '/conductExam');
      }
      this.httpService.spinner.hide();
    })
  }

  cancel() {
    this.router.navigateByUrl(this.httpService.userRole + '/conductExam');
  }


  clearVal() {
    this.mcqQueList = [];
    this.codeQueList = [];
    this.eassyQueList = [];
    this.mcqQueCount = 1;
    this.codeQueCount = 1;
    this.eassyQueCount = 1;
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

  addNewQuestion(val: any, formVal?: any) {
    if (val.examType == 'mcq') {
      this.examDetailForm.addControl("mcqQues_" + this.mcqQueCount, new FormControl(""));
      this.examDetailForm.addControl("mcqQues_" + this.mcqQueCount + '_ans', new FormControl(""));
      this.examDetailForm.addControl("mcqQues_" + this.mcqQueCount + '_mark', new FormControl(""));
      this.mcqQueList.push({ que: this.mcqQueCount, ans: "", option: [], mark: "", index: this.mcqQueCount });

      if (formVal != null && formVal != undefined) {
        this.examDetailForm.get("mcqQues_" + this.mcqQueCount).patchValue(formVal.question);
        this.examDetailForm.get("mcqQues_" + this.mcqQueCount + '_ans').patchValue(formVal.answer);
        this.examDetailForm.get("mcqQues_" + this.mcqQueCount + '_mark').patchValue(formVal.marks);
      }
      this.mcqQueCount = this.mcqQueCount + 1;
    } else if (val.examType == 'essay') {
      this.examDetailForm.addControl("essayQues_" + this.eassyQueCount, new FormControl(""));
      this.examDetailForm.addControl("essayQues_" + this.eassyQueCount + '_mark', new FormControl(""));
      this.eassyQueList.push({ que: this.eassyQueCount, mark: "", index: this.mcqQueCount });

      if (formVal != null && formVal != undefined) {
        this.examDetailForm.get("essayQues_" + this.eassyQueCount).patchValue(formVal.question);
        this.examDetailForm.get("essayQues_" + this.eassyQueCount + '_mark').patchValue(formVal.marks);
      }
      this.eassyQueCount = this.eassyQueCount + 1;
    } else if (val.examType == 'code') {
      this.examDetailForm.addControl("codeQues_" + this.codeQueCount, new FormControl(""));
      this.examDetailForm.addControl("codeQues_" + this.codeQueCount + '_mark', new FormControl(""));
      this.codeQueList.push({ que: this.codeQueCount, ans: "", mark: "", index: this.mcqQueCount });

      if (formVal != null && formVal != undefined) {
        this.examDetailForm.get("codeQues_" + this.codeQueCount).patchValue(formVal.question);
        this.examDetailForm.get("codeQues_" + this.codeQueCount + '_mark').patchValue(formVal.marks);
      }

      this.codeQueCount = this.codeQueCount + 1;
    }
  }

  addNewOption(val: any, formVal?: any) {
    this.mcqQueList.forEach(item => {
      if (val == item.que) {
        let count = item.option.length + 1;
        this.examDetailForm.addControl('mcqQues_' + val + '_option_' + count, new FormControl(""));
        if (formVal != null && formVal != undefined && formVal != '') {
          this.examDetailForm.get('mcqQues_' + val + '_option_' + count).patchValue(formVal ? formVal : '');
        }
        item.option.push({ ansCount: count });
      }
    });
  }

  setMark(val: any, formVal: any) {
    this.examDetailForm.get('total').patchValue(parseInt(formVal.total) + parseInt(val));
  }

  setReadData() {
    if (this.httpService.checkValNull(this.httpService.tempExamDetailDetail)) {
      this.alert("warning", "Exam detail not Found", "editFrom");
    } else {
      this.examDetailForm.get("examType").patchValue(this.httpService.tempExamDetailDetail.examType);
      this.examDetailForm.get("name").patchValue(this.httpService.tempExamDetailDetail.name);
      this.examDetailForm.get("attempts").patchValue(this.httpService.tempExamDetailDetail.attempts);
      this.examDetailForm.get("time").patchValue(this.httpService.tempExamDetailDetail.time);
      this.examDetailForm.get("date").patchValue(this.httpService.tempExamDetailDetail.date != undefined ? new Date(this.httpService.tempExamDetailDetail.date) : '');
      this.examDetailForm.get("total").patchValue(this.httpService.tempExamDetailDetail.total);
      this.examDetailForm.get("course").patchValue(this.httpService.tempExamDetailDetail.course);
      this.examDetailForm.get("id").patchValue(this.httpService.tempExamDetailDetail._id);

      if (this.httpService.tempExamDetailDetail.questions != undefined) {
        this.httpService.tempExamDetailDetail.questions.forEach(item => {
          this.addNewQuestion(this.examDetailForm.value, item);
          if (item.options != null && this.examDetailForm.get('examType')?.value == 'mcq') {
            item.options.forEach((value: boolean, index: string) => {
              this.addNewOption((this.mcqQueCount - 1), value[index + 1]);
            });
          }
        });
      }
    }
  }

  uploadUserProfile(event: any, type: any, data: any) {
    this.httpService.spinner.show();
    let urlEndPoint;
    let obj = new FormData();
    urlEndPoint = "upload/file?folder=images";
    obj.append("file", event.target.files[0], event.target.files[0].name);

    this.httpService.httpRequest(urlEndPoint, obj, "post", true, false).subscribe((resp) => {
      if (resp.status == "success" && resp.responseCode == "200") {
        this.mcqQueList.forEach(element => {
          if (data.index == element.index) {
            element['file'] = resp.data.path
          }
        });
        this.profileImg = event.target.files[0].name;
        this.httpService.showToastMsgHandler("info", resp.data?.message);
        this.httpService.spinner.hide();
      }
    })
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
      if (result == "Y") this.router.navigateByUrl(this.httpService.userRole + "/conductExam");
    })
  }

  deleteQuestion(val: any) {
    this.mcqQueList.splice(this.mcqQueList.findIndex(v => v.index === val.index), 1);
    console.log(this.mcqQueList);
  }

}
