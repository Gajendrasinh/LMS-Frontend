import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/service/http.service';
import Tabulator from 'tabulator-tables';

@Component({
  selector: 'app-common-listing-tbl',
  templateUrl: './common-listing-tbl.component.html',
  styleUrls: ['./common-listing-tbl.component.scss']
})
export class CommonListingTblComponent implements OnInit {

  title: any = "";

  webinarTbl: any;
  upCommingExamTbl: any;
  documentFileTbl: any;
  perviousExamTbl: any
  feedbackTbl: any;
  examCheckTbl: any;

  feedbackList: any[] = [];
  examList: any[] = [];
  webinarList: any[] = [];
  documentList: any[] = [];
  perviousExamResultList: any[] = [];
  examCheckList: any[] = [];

  constructor(public router: Router, public httpService: HttpService) { }

  ngOnInit(): void {
    if (this.router.url.startsWith("/" + this.httpService.userRole + "/upCommingTest")) {
      this.title = "Upcoming Test";
    } else if (this.router.url.startsWith("/" + this.httpService.userRole + "/upCommingWebinar")) {
      this.title = "Upcomming Webinar";
    } else if (this.router.url.startsWith("/" + this.httpService.userRole + "/documentFile")) {
      this.title = "Document File";
    } else if (this.router.url.startsWith("/" + this.httpService.userRole + "/perviousExamResult")) {
      this.title = "Pervious Exam Result";
    } else if (this.router.url.startsWith("/" + this.httpService.userRole + "/examResult")) {
      this.title = "Exam Result";
    } else if (this.router.url.startsWith("/" + this.httpService.userRole + "/examAttendance")) {
      this.title = "Student Exam Attendance";
    } else if (this.router.url.startsWith("/" + this.httpService.userRole + "/feedBackListing")) {
      this.title = "Feedback";
    } else if (this.router.url.startsWith("/" + this.httpService.userRole + "/examCheck")) {
      this.title = "Exam Pending Marking";
    }

  }

  ngAfterViewInit() {
    if (this.router.url.startsWith("/" + this.httpService.userRole + "/upCommingTest")) {
      this.setExamTbl();
      this.getExamDetail();
    } else if (this.router.url.startsWith("/" + this.httpService.userRole + "/upCommingWebinar")) {
      this.setUpcommingWebinarTbl();
      this.getWebinarDetail();
    } else if (this.router.url.startsWith("/" + this.httpService.userRole + "/documentFile")) {
      this.setDocumentTbl();
      this.getDocumentDetail
    } else if (this.router.url.startsWith("/" + this.httpService.userRole + "/perviousExamResult")) {
      this.setPerviousExamTbl();
      this.getPerviousExamResult();
    } else if (this.router.url.startsWith("/" + this.httpService.userRole + "/examResult")) {
      this.setPerviousExamTbl();
      // this.getPerviousExamResult();
    } else if (this.router.url.startsWith("/" + this.httpService.userRole + "/examAttendance")) {
      this.setPerviousExamTbl();
      // this.getPerviousExamResult();
    } else if (this.router.url.startsWith("/" + this.httpService.userRole + "/feedBackListing")) {
      this.setfeedbackTbl();
      this.getFeedbackList();
    } else if (this.router.url.startsWith("/" + this.httpService.userRole + "/examCheck")) {
      this.setExamCheckTbl();
      this.getExamCheckList();
    }
  }

  setExamTbl() {
    this.upCommingExamTbl = new Tabulator("#upcomming-exam-table", {
      height: '100%',
      layout: 'fitColumns',
      columnHeaderVertAlign: 'bottom',
      pagination: 'remote',
      paginationSize: 10,
      tooltipGenerationMode: 'hover',
      paginationSizeSelector: [10, 100, 500, 1000],
      movableColumns: true,
      responsiveLayout: true,
      placeholder: 'No records found.',
      headerFilterPlaceholder: '',
      ajaxFiltering: false,
      ajaxLoader: false,
      tooltipsHeader: true,
      ajaxRequesting: (url: any, params: any) => {
        if (params != undefined && params.pageNo != undefined && params.recPerPage != undefined) {
          this.getExamDetail();
        }
      },
      ajaxResponse: (url: any, params: any, response: any) => {
        this.examList = [];
        this.httpService.spinner.hide();
        if (response.status == 'success' && response.responseCode == '200') {
          let _lastPage = Math.ceil(response.data?.list?.totalLength / parseInt(this.upCommingExamTbl.getPageSize()));
          let count = 1;
          response.data?.list.forEach(item => {
            item["srNo"] = count;
            item["courseName"] = item.course[0].name;
            this.examList.push(item);
            count = count + 1;
          });
          let data = { last_page: _lastPage, data: this.examList, };
          return data;
        } else {
          let data = { last_page: 0, data: [], };
          return data;
        }
      },
      ajaxError: (error: any) => { },
      ajaxContentType: 'json',
      paginationDataSent: {
        page: 'pageNumber',
        size: 'perPage',
      },
      columns: [
        { title: "Sr. No.", field: "srNo", sorter: "number", width: 100 },
        { title: "Course Name", field: "courseName", sorter: "string" },
        { title: "A", field: "name", sorter: "string" },
        { title: "Date of Exam", field: "date", sorter: "string" },
        { title: "Time", field: "time", sorter: "string" },
        {
          title: "Take Exam", formatter: this.httpService.viewbutton, align: "center", width: 100, headerSort: false, cellClick: (e: any, cell: any) => {
            if (e.target.id == "view") {
              let id = cell._cell.row.data?._id;
              this.router.navigateByUrl(`/student/exam-paper/${id}`)
              this.httpService.tempExamDetailDetail = cell._cell.row.data;
            }
          }
        }
      ],
    });
  }

  setPerviousExamTbl() {
    this.perviousExamTbl = new Tabulator("#pervious-exam-table", {
      height: '100%',
      layout: 'fitColumns',
      columnHeaderVertAlign: 'bottom',
      pagination: 'remote',
      paginationSize: 10,
      tooltipGenerationMode: 'hover',
      paginationSizeSelector: [10, 100, 500, 1000],
      movableColumns: true,
      responsiveLayout: true,
      placeholder: 'No records found.',
      headerFilterPlaceholder: '',
      ajaxFiltering: false,
      ajaxLoader: false,
      tooltipsHeader: true,
      ajaxRequesting: (url: any, params: any) => {
        if (params != undefined && params.pageNo != undefined && params.recPerPage != undefined) {
          this.getPerviousExamResult();
        }
      },
      ajaxResponse: (url: any, params: any, response: any) => {
        this.perviousExamResultList = [];
        this.httpService.spinner.hide();
        if (response.status == 'success' && response.responseCode == '200') {
          let _lastPage = Math.ceil(response.data.list.totalLength / parseInt(this.perviousExamTbl.getPageSize()));
          let count = 1;
          response.data.list.forEach(item => {
            item["srNo"] = count;
            if (item.pass != undefined && item.pass == false) item.pass = 'Fail'
            if (item.pass != undefined && item.pass == true) item.pass = 'Pass'
            this.perviousExamResultList.push(item);
            count = count + 1;
          });
          let data = { last_page: _lastPage, data: this.perviousExamResultList, };
          return data;
        } else {
          let data = { last_page: 0, data: [], };
          return data;
        }
      },
      ajaxError: (error: any) => { },
      ajaxContentType: 'json',
      paginationDataSent: {
        page: 'pageNumber',
        size: 'perPage',
      },
      columns: [
        { title: "Sr. No.", field: "srNo", sorter: "number", width: 100 },
        { title: "Course Name", field: "examId", sorter: "string" },
        { title: "Attempts", field: "attempts", sorter: "string" },
        { title: "Total", field: "total", sorter: "string" },
        { title: "Marks Obtained", field: "totalMarksObtained", sorter: "string" },
        { title: "Result", field: "pass", sorter: "string" },

      ],
    });
  }

  setUpcommingWebinarTbl() {
    this.webinarTbl = new Tabulator("#webinar-table", {
      height: '100%',
      layout: 'fitColumns',
      columnHeaderVertAlign: 'bottom',
      pagination: 'remote',
      paginationSize: 10,
      tooltipGenerationMode: 'hover',
      paginationSizeSelector: [10, 100, 500, 1000],
      movableColumns: true,
      responsiveLayout: true,
      placeholder: 'No records found.',
      headerFilterPlaceholder: '',
      ajaxFiltering: false,
      ajaxLoader: false,
      tooltipsHeader: true,
      ajaxRequesting: (url: any, params: any) => {
        if (params != undefined && params.pageNo != undefined && params.recPerPage != undefined) {
          this.getWebinarDetail();
        }
      },
      ajaxResponse: (url: any, params: any, response: any) => {
        this.webinarList = [];
        this.httpService.spinner.hide();
        if (response.status == 'success' && response.responseCode == '200') {
          let _lastPage = Math.ceil(response.data.list.totalLength / parseInt(this.webinarTbl.getPageSize()));
          let count = 1;
          response.data.list.forEach(item => {
            item["srNo"] = count;
            this.webinarList.push(item);
            count = count + 1;
          })
          let data = { last_page: _lastPage, data: this.webinarList, };
          return data;
        } else {
          let data = { last_page: 0, data: [], };
          return data;
        }
      },
      ajaxError: (error: any) => { },
      ajaxContentType: 'json',
      paginationDataSent: {
        page: 'pageNumber',
        size: 'perPage',
      },
      columns: [
        { title: "Sr. No.", field: "srNo", sorter: "number", width: 100 },
        { title: "Name of Webinar", field: "name", sorter: "string" },
        { title: "Date", field: "time", sorter: "string" },
        { title: "Password", field: "password", sorter: "string" },
      ],
    });
  }

  setDocumentTbl() {
    this.documentFileTbl = new Tabulator("#document-file-table", {
      height: '100%',
      layout: 'fitColumns',
      columnHeaderVertAlign: 'bottom',
      pagination: 'remote',
      paginationSize: 10,
      tooltipGenerationMode: 'hover',
      paginationSizeSelector: [10, 100, 500, 1000],
      movableColumns: true,
      responsiveLayout: true,
      placeholder: 'No records found.',
      headerFilterPlaceholder: '',
      ajaxFiltering: false,
      ajaxLoader: false,
      tooltipsHeader: true,
      ajaxRequesting: (url: any, params: any) => {
        if (params != undefined && params.pageNo != undefined && params.recPerPage != undefined) {
          this.getDocumentDetail();
        }
      },
      ajaxResponse: (url: any, params: any, response: any) => {
        this.examList = [];
        this.httpService.spinner.hide();
        if (response.status == 'success' && response.responseCode == '200') {
          let _lastPage = Math.ceil(response.data.list.totalLength / parseInt(this.documentFileTbl.getPageSize()));
          let count = 1;
          response.data.list.forEach(item => {
            item["srNo"] = count;
            item["courseName"] = item.course[0].name;
            this.examList.push(item);
            count = count + 1;
          });
          let data = { last_page: _lastPage, data: this.documentList, };
          return data;
        } else {
          let data = { last_page: 0, data: [], };
          return data;
        }
      },
      ajaxError: (error: any) => { },
      ajaxContentType: 'json',
      paginationDataSent: {
        page: 'pageNumber',
        size: 'perPage',
      },
      columns: [
        { title: "Sr. No.", field: "srNo", sorter: "number", width: 100 },
        { title: "File Name", field: "_id", sorter: "string" },
        { title: "Date of Certificate", field: "firstname", sorter: "string" },
        { title: "File Type", field: "lastname", sorter: "string" },
        {
          title: "", formatter: () => {
            '<a href="javascript:void(0)" class="btn btn-lg btn-block btn-success">View More</a>'
          }, align: "center", width: 100, headerSort: false, cellClick: (e: any, cell: any) => {
            if (e.target.id == "view") {
              let id = cell._cell.row.data?._id;

              this.httpService.tempExamDetailDetail = cell._cell.row.data;
            }
          }
        }
      ],
    });
  }

  getExamDetail() {
    this.httpService.spinner.show();
    this.httpService.ajaxConfig.headers.Authorization = this.httpService.getToken('accessToken')
    this.upCommingExamTbl.setData(this.httpService.wshost + 'student/list/exam?isUpcoming=true', "", this.httpService.ajaxConfig);
  }

  getWebinarDetail() {
    this.httpService.spinner.show();
    this.httpService.ajaxConfig.headers.Authorization = this.httpService.getToken('accessToken')
    this.webinarTbl.setData(this.httpService.wshost + 'student/list/webinar', "", this.httpService.ajaxConfig);
  }

  getDocumentDetail() {
    // this.httpService.spinner.show();
    this.httpService.ajaxConfig.headers.Authorization = this.httpService.getToken('accessToken')
    // this.documentFileTbl.setData(this.httpService.wshost + 'student/list/exam', "", this.httpService.ajaxConfig);
  }

  getPerviousExamResult() {
    this.httpService.spinner.show();
    this.httpService.ajaxConfig.headers.Authorization = this.httpService.getToken('accessToken')
    this.perviousExamTbl.setData(this.httpService.wshost + 'student/list/exam?isUpcoming=false', "", this.httpService.ajaxConfig);
  }

  perviousExamBtn() {
    this.router.navigateByUrl(`/student/perviousExamResult`);
  }

  setfeedbackTbl() {
    this.feedbackTbl = new Tabulator("#feedback-table", {
      height: '100%',
      layout: 'fitColumns',
      columnHeaderVertAlign: 'bottom',
      pagination: 'remote',
      paginationSize: 10,
      tooltipGenerationMode: 'hover',
      paginationSizeSelector: [10, 100, 500, 1000],
      movableColumns: true,
      responsiveLayout: true,
      placeholder: 'No records found.',
      headerFilterPlaceholder: '',
      ajaxFiltering: false,
      ajaxLoader: false,
      tooltipsHeader: true,
      ajaxRequesting: (url: any, params: any) => {
        if (params != undefined && params.pageNo != undefined && params.recPerPage != undefined) {
          this.getFeedbackList();
        }
      },
      ajaxResponse: (url: any, params: any, response: any) => {
        this.feedbackList = [];
        this.httpService.spinner.hide();
        if (response.status == 'success' && response.responseCode == '200') {
          let _lastPage = Math.ceil(response.data.list.totalLength / parseInt(this.feedbackTbl.getPageSize()));
          let count = 1;
          response.data.list.forEach(item => {
            item["srNo"] = count;
            this.feedbackList.push(item);
            count = count + 1;
          });
          let data = { last_page: _lastPage, data: this.feedbackList, };
          return data;
        } else {
          let data = { last_page: 0, data: [], };
          return data;
        }
      },
      ajaxError: (error: any) => { },
      ajaxContentType: 'json',
      paginationDataSent: {
        page: 'pageNumber',
        size: 'perPage',
      },
      columns: [
        { title: "Sr. No.", field: "srNo", sorter: "number", width: 100 },
        { title: "Name", field: "name", sorter: "string" },
        { title: "Email", field: "email", sorter: "string" },
        { title: "Comment", field: "comment", sorter: "string" },
        { title: "Date", field: "createdAt", sorter: "string" },
      ],
    });
  }

  getFeedbackList() {
    this.httpService.spinner.show();
    this.httpService.ajaxConfig.headers.Authorization = this.httpService.getToken('accessToken')
    this.feedbackTbl.setData(this.httpService.wshost + 'admin/feedback/list', "", this.httpService.ajaxConfig);
  }

  setExamCheckTbl() {
    this.examCheckTbl = new Tabulator("#exam-check-table", {
      height: '100%',
      layout: 'fitColumns',
      columnHeaderVertAlign: 'bottom',
      pagination: 'remote',
      paginationSize: 10,
      tooltipGenerationMode: 'hover',
      paginationSizeSelector: [10, 100, 500, 1000],
      movableColumns: true,
      responsiveLayout: true,
      placeholder: 'No records found.',
      headerFilterPlaceholder: '',
      ajaxFiltering: false,
      ajaxLoader: false,
      tooltipsHeader: true,
      ajaxRequesting: (url: any, params: any) => {
        if (params != undefined && params.pageNo != undefined && params.recPerPage != undefined) {
          this.getFeedbackList();
        }
      },
      ajaxResponse: (url: any, params: any, response: any) => {
        this.examCheckList = [];
        this.httpService.spinner.hide();
        if (response.status == 'success' && response.responseCode == '200') {
          // let _lastPage = Math.ceil(response.data?.exams.totalLength / parseInt(this.feedbackTbl.getPageSize()));
          let count = 1;
          if (response.data?.exams != undefined) {
            response.data?.exams.forEach(item => {
              item["srNo"] = count;
              this.examCheckList.push(item);
              count = count + 1;
            });
          }
          let data = { last_page: 0, data: this.examCheckList, };
          return data;
        } else {
          let data = { last_page: 0, data: [], };
          return data;
        }
      },
      ajaxError: (error: any) => { },
      ajaxContentType: 'json',
      paginationDataSent: {
        page: 'pageNumber',
        size: 'perPage',
      },
      columns: [
        {
          title: "Action", formatter: this.httpService.editAction, align: "center", width: 75, headerSort: false, cellClick: (e: any, cell: any) => {
            if (e.target.id == "edit") {
              let id = cell._cell.row.data?.studentId;
              this.httpService.tempExamMarkingDetail = cell._cell.row.data;
              if (id != undefined)
                this.router.navigateByUrl(this.httpService.userRole + "/examMarking/" + id);
              else
                this.httpService.showToastMsgHandler('info', 'Something wrong please try again');
            }
          }
        },
        { title: "Sr. No.", field: "srNo", sorter: "number", width: 100 },
        { title: "Exam", field: "name", sorter: "string" },
        { title: "Type", field: "type", sorter: "string" },
        { title: "Total Marks", field: "total", sorter: "string" },
        { title: "Mark Obtained", field: "totalMarksObtained", sorter: "string" },
        { title: "Date", field: "examDate", sorter: "string" },
      ],
    });
  }

  getExamCheckList() {
    this.httpService.spinner.show();
    this.httpService.ajaxConfig.headers.Authorization = this.httpService.getToken('accessToken')
    this.examCheckTbl.setData(this.httpService.wshost + 'employee/exam/pending/list', "", this.httpService.ajaxConfig);
  }

}
