import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddRecordsPopupComponent } from 'src/app/common/add-records-popup/add-records-popup.component';
import { CommonAlertComponent } from 'src/app/common/common-alert/common-alert.component';
import { HttpService } from 'src/app/service/http.service';
import Tabulator from 'tabulator-tables';


@Component({
  selector: 'app-conduct-exam',
  templateUrl: './conduct-exam.component.html',
  styleUrls: ['./conduct-exam.component.scss']
})
export class ConductExamComponent implements OnInit {

  perpage: any = '10';
  pageNumber: any = '1';
  examQueTbl: any;
  examType: any = 'mcq';
  clgId: any;
  collageList: any;
  selectedClg: any = null;
  isShowClgSelect: boolean = false;
  isShowViewExamResultBtn: boolean = false;

  examDetailList: any[] = [];
  filterDate: any = new Date();

  constructor(private router: Router, public httpService: HttpService, public modelService: NgbModal) {

  }

  ngOnInit(): void {
    if (this.httpService.userRole == 'college') this.isShowViewExamResultBtn = true;

    this.clgId = this.httpService.userRole == 'college' ? this.httpService.userDetail._id : this.httpService.userDetail?.college?._id;

    if (this.httpService.userRole == 'admin') {
      this.isShowClgSelect = true;
      this.getCollageList();
    }

    this.setExamListingTbl();
    this.choiceQuestionList("mcq");

  }

  setExamListingTbl() {
    this.examQueTbl = new Tabulator("#exam-table", {
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
          this.perpage = params.recPerPage;
          this.pageNumber = params.pageNo;
          this.choiceQuestionList(this.examType);
        }
      },
      ajaxResponse: (url: any, params: any, response: any) => {
        this.examDetailList = [];
        this.httpService.spinner.hide();
        if (response.status == 'success' && response.responseCode == '200') {
          let _lastPage = Math.ceil(response.data?.totalLength / parseInt(this.examQueTbl.getPageSize()));
          let count = 1;
          response.data?.exams.forEach(item => {
            item["srNo"] = count;
            this.examDetailList.push(item);
            count = count + 1;
          });
          let data = { last_page: _lastPage, data: this.examDetailList, };
          return data;
        } else {
          let data = { last_page: 0, data: [], };
          return data;
        }
      },
      ajaxError: (error: any) => {
      },
      paginationDataSent: {
        page: 'pageNumber',
        size: 'perPage',
      },
      ajaxContentType: "json",
      columns: [
        { title: "No", field: "srNo", sorter: "number", headerSort: false, width: 50 },
        { title: "Test Name", field: "name", sorter: "string" },
        { title: "Date", field: "date", sorter: "string" },
        { title: "Course", field: "course", sorter: "string" },
        {
          title: "View Test", formatter: this.httpService.examActionBox, align: "center", width: 100, headerSort: false, cellClick: (e: any, cell: any) => {
            if (e.target.id == "view") {
              let id = cell._cell.row.data?._id;
              this.httpService.tempExamDetailDetail = cell._cell.row.data;
              this.router.navigateByUrl(this.httpService.userRole + "/viewExamQuestions/" + id);
            } if (e.target.id == "edit") {
              let id = cell._cell.row.data?._id;
              this.httpService.tempExamDetailDetail = cell._cell.row.data;
              this.router.navigateByUrl(this.httpService.userRole + "/editExamQuestions/" + id);
            } else if (e.target.id == "delete") {
              this.deleteAlert(cell._cell.row.data);
            }
          }
        }
      ],
    });
  }

  deleteAlert(examVal: any) {
    const initialState = {
      alertType: "warning",
      msg: "Are you Sure you want to delete?"
    }

    const modalRef = this.modelService.open(CommonAlertComponent, { centered: true, backdrop: 'static', keyboard: false })
    modalRef.componentInstance.data = initialState;

    modalRef.result.then((result) => {
      if (result == "Y") {
        this.deleteStudentRecord(examVal)
      }
    })
  }

  deleteStudentRecord(examVal: any) {
    if (!this.httpService.checkValNull(examVal._id)) {
      this.httpService.httpRequest("college/" + this.clgId + "/exam/" + examVal._id, "", "delete", false, true).subscribe((resp) => {
        if (resp.status == "success" && resp.responseCode == "200") {
          this.httpService.showToastMsgHandler("success", resp.message);
          this.choiceQuestionList(this.examType);
        }
      })
    }
  }

  choiceQuestionList(testType: any) {
    if (this.clgId != undefined && this.clgId != "") {
      this.httpService.spinner.show();
      let ajaxParams = { type: testType };
      this.httpService.ajaxConfig.headers.Authorization = this.httpService.getToken('accessToken')
      this.examQueTbl.setData(this.httpService.wshost + "college/" + this.clgId + "/exams", ajaxParams, this.httpService.ajaxConfig);
    }
  }

  importModalaPopup() {
    const initialState = {
      title: 'Exam',
    };

    const modalRef = this.modelService.open(AddRecordsPopupComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.data = initialState;

    modalRef.result.then((result) => {
      if (result.type == 'single')
        this.router.navigateByUrl(this.httpService.userRole + "/addExamQuestions");
      else if (result.type == 'bulk') { this.bulkDataUpload(result);}
    });
  }

  bulkDataUpload(result: any) {
    let clgId = this.httpService.userRole == 'college' ? this.httpService.userDetail._id : this.httpService.userDetail?.college?._id;
    let urlEndPoint = "college/" + clgId + "/exam";
    
    if ( result.list.arrObj != undefined && result.list.arrObj.length > 0) {
      this.httpService .httpRequest(urlEndPoint, result.list.arrObj[0], 'post', false, true )
        .subscribe((resp) => {
          if (resp.status == 'success' && resp.responseCode == '200') {
            this.httpService.showToastMsgHandler(
              'success',
              resp?.data?.message
            );
            this.choiceQuestionList(this.examType);
          }
        });
    } else {
      this.httpService.showToastMsgHandler(
        'warning',
        'Please Try again someting wrong'
      );
    }
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

  clgChange(clg: any) {
    if (clg != null && clg != undefined && clg != "") {
      this.clgId = clg;
      this.choiceQuestionList(this.examType);
    }
  }

  viewExamResult() {
    this.router.navigateByUrl("college/examResult")
  }

}
