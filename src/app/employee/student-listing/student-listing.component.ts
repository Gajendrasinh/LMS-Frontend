import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddRecordsPopupComponent } from 'src/app/common/add-records-popup/add-records-popup.component';
import { CommonAlertComponent } from 'src/app/common/common-alert/common-alert.component';
import { HttpService } from 'src/app/service/http.service';
import Tabulator from 'tabulator-tables';

@Component({
  selector: 'app-student-listing',
  templateUrl: './student-listing.component.html',
  styleUrls: ['./student-listing.component.scss'],
})
export class StudentListingComponent implements OnInit {
  filterType: any = '';
  searchFilter: any = '';
  atozFilter: any = '';
  departmentFilter: any = '';
  dojFilter: any = '';
  totalStudentCount: any = 0;
  studentTbl: any;

  perpage: any = '100';
  pageNumber: any = '1';

  studentTabListing: any[] = [];
  departmentList: any[] = [];

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    public httpService: HttpService,
    public modelService: NgbModal
  ) { }

  ngOnInit(): void {
    this.studentTbl = new Tabulator('#student-table', {
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
          this.getStdTabListingDetail();
        }
       },
      ajaxResponse: (url: any, params: any, response: any) => {
        this.studentTabListing = [];
        this.httpService.spinner.hide();
        if (response.status == 'success' && response.responseCode == '200') {
          let _lastPage = Math.ceil(response.data.students.totalStudents / parseInt(this.studentTbl.getPageSize()));
          let count = 1;
          response.data?.students?.list.forEach((item) => {
            item['srNo'] = count;
            this.studentTabListing.push(item);
            count = count + 1;
          });
          this.totalStudentCount = response.data?.students?.totalStudents;
          // this.httpService.getPageInfo(this.studentTbl.element.id, this.perpage, this.pageNumber, this.totalStudentCount);
          let data = { last_page: _lastPage, data: this.studentTabListing, };
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
        { formatter: 'rowSelection', titleFormatter: 'rowSelection', align: 'center', headerSort: false, width: 50, },
        {
          title: 'Action', formatter: this.httpService.actionBox, align: 'center', width: 75, headerSort: false,
          cellClick: (e: any, cell: any) => {
            if (e.target.id == 'edit') {
              let id = cell._cell.row.data?._id;
              this.httpService.tempStdEditDetail = cell._cell.row.data;
              this.router.navigateByUrl('/employee/editStudent/' + id);
            } else if (e.target.id == 'delete') {
              this.deleteAlert(cell._cell.row.data);
            }
          },
        },
        { title: 'Sr. No.', field: 'srNo', sorter: 'number', width: 100 },
        { title: 'Student Id', field: '_id', sorter: 'string' },
        { title: 'First Name', field: 'firstname', sorter: 'string' },
        { title: 'Last Name', field: 'lastname', sorter: 'string' },
        { title: 'Email Id', field: 'email', sorter: 'string' },
        { title: 'Department Name', field: 'coursename', sorter: 'string' },
        { title: 'Date of joing', field: 'dateofjoining', sorter: 'string' },
      ],
    });

    this.getDepartment();
    this.getStdTabListingDetail();
  }

  filterChange(val) {
    this.clearFilter('N');
    this.filterType = val;
  }

  getStdTabListingDetail() {
    this.httpService.spinner.show();
    let ajaxParams = {
      search: this.searchFilter, department: this.departmentFilter, dateOfJoining: this.httpService.changeDateFilter(this.dojFilter),
    };
    this.httpService.ajaxConfig.headers.Authorization = this.httpService.getToken('accessToken')
    this.studentTbl.setData(this.httpService.wshost + 'student/list', ajaxParams, this.httpService.ajaxConfig);
  }

  clearFilter(call: any) {
    this.filterType = '';
    this.searchFilter = '';
    this.atozFilter = '';
    this.departmentFilter = '';
    this.dojFilter = '';
    if (call == 'Y') this.getStdTabListingDetail();
  }

  importModalaPopup() {
    const initialState = {
      title: 'Student',
    };

    const modalRef = this.modelService.open(AddRecordsPopupComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.data = initialState;

    modalRef.result.then((result) => {
      if (result.type == 'single')
        this.router.navigateByUrl('employee/newStudent');
      else if (result.type == 'bulk') this.bulkDataUpload(result);
    });
  }

  bulkDataUpload(result: any) {
    if (
      result.list.arrObj != undefined &&
      result.list.arrObj.length > 0 &&
      result.clg != undefined
    ) {
      this.httpService
        .httpRequest(
          'student/bulk/upload/' + result.clg,
          { students: result.list.arrObj },
          'post',
          false,
          true
        )
        .subscribe((resp) => {
          if (resp.status == 'success' && resp.responseCode == '200') {
            this.httpService.showToastMsgHandler(
              'success',
              resp?.data?.message
            );
            this.getStdTabListingDetail();
          }
        });
    } else {
      this.httpService.showToastMsgHandler(
        'warning',
        'Please Try again someting wrong'
      );
    }
  }

  exportListData() {
    this.studentTbl.download('csv', 'studentDetail.csv');
  }

  deleteAlert(stdVal: any) {
    const initialState = {
      alertType: 'warning',
      msg: 'Are you Sure you want to delete?',
    };

    const modalRef = this.modelService.open(CommonAlertComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.data = initialState;

    modalRef.result.then((result) => {
      if (result == 'Y') {
        this.deleteStudentRecord(stdVal);
      }
    });
  }

  deleteStudentRecord(stdVal: any) {
    if (!this.httpService.checkValNull(stdVal._id)) {
      this.httpService
        .httpRequest('student/' + stdVal._id, '', 'delete', false, true)
        .subscribe((resp) => {
          if (resp.status == 'success' && resp.responseCode == '200') {
            this.httpService.showToastMsgHandler('success', resp.message);
            this.getStdTabListingDetail();
          }
        });
    }
  }

  bulkDataDelete() {
    if (this.studentTbl.getSelectedData().length != 0) {
      let deleteIds: any[] = [];
      this.studentTbl.getSelectedData().forEach((item) => {
        deleteIds.push(item._id);
      });
      this.httpService
        .httpRequest(
          'student/bulk/list',
          { ids: deleteIds },
          'delete',
          false,
          true
        )
        .subscribe((resp) => {
          if (resp.status == 'success' && resp.responseCode == '200') {
            this.httpService.showToastMsgHandler('success', resp.message);
            this.getStdTabListingDetail();
          }
        });
    }
  }

  getDepartment() {
    this.httpService.spinner.show();
    let clgId =
      this.httpService.userRole == 'college'
        ? this.httpService.userDetail._id
        : this.httpService.userDetail?.college?._id;
    let urlEndPoint = 'college/' + clgId + '/departments';
    this.httpService
      .httpRequest(urlEndPoint, '', 'get', false, true)
      .subscribe((resp) => {
        if (resp.status == 'success' && resp.responseCode == '200')
          this.departmentList = resp.data.departments;
        this.httpService.spinner.hide();
      });
  }
}
