import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonAlertComponent } from 'src/app/common/common-alert/common-alert.component';
import { HttpService } from 'src/app/service/http.service';
import Tabulator from 'tabulator-tables';

@Component({
  selector: 'app-course-listing',
  templateUrl: './course-listing.component.html',
  styleUrls: ['./course-listing.component.scss'],
})
export class CourseListingComponent implements OnInit {
  searchFilter: any = '';
  perpage: any = '10';
  pageNumber: any = '1';

  totalCourseCount: any = 0;
  collagesList: any[] = [];
  coursetTblList: any[] = [];
  courseTbl: any;
  id: any;

  selectedClg: any = null;
  selectedDprt: any = null;
  selectedCourse: any = null;

  constructor(
    private router: Router,
    public httpService: HttpService,
    public modelService: NgbModal,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((prm) => {
      this.httpService.spinner.show();
      this.id = prm['id'];
    });

    this.courseTbl = new Tabulator('#course-table', {
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
        if (
          params != undefined &&
          params.pageNo != undefined &&
          params.recPerPage != undefined
        ) {
          this.perpage = params.recPerPage;
          this.pageNumber = params.pageNo;
          this.getCourseTabListingDetail();
        }
      },
      ajaxResponse: (url: any, params: any, response: any) => {
        this.coursetTblList = [];
        this.httpService.spinner.hide();
        if (response.status == 'success' && response.responseCode == '200') {
          let data: any = [];
          let resp = response.data.course;

          // if (resp.length > 0) {
          let _lastPage = Math.ceil(
            resp.totalLength / parseInt(this.courseTbl.getPageSize())
          );
          let count = 1;

          resp?.list.forEach((item) => {
            item['srNo'] = count;
            if (this.selectedClg != null && this.selectedClg != '') {
              if (this.selectedClg == item.college?._id)
                this.coursetTblList.push(item);
            } else {
              this.coursetTblList.push(item);
            }
            count = count + 1;
          });
          this.totalCourseCount = response.data?.course?.totalLength;
          data = { last_page: _lastPage, data: this.coursetTblList };
          // } else {
          //   data = { last_page: 0, data: [] };
          // }

          return data;
        } else {
          let data = { last_page: 0, data: [] };
          return data;
        }
      },
      ajaxError: (error: any) => {
        this.httpService.spinner.hide();
      },
      ajaxContentType: 'json',
      paginationDataSent: {
        page: 'pageNumber',
        size: 'perPage',
      },
      columns: [
        {
          title: 'Action',
          formatter: this.httpService.actionBoxwithView,
          align: 'center',
          width: 120,
          headerSort: false,
          cellClick: (e: any, cell: any) => {
            if (e.target.id == 'edit') {
              let id = cell._cell.row.data?._id;
              this.httpService.tempCourseEditDetail = cell._cell.row.data;
              this.router.navigateByUrl('/employee/editCourse/' + id);
            } else if (e.target.id == 'delete') {
              this.deleteAlert(cell._cell.row.data);
            } else if (e.target.id == 'view') {
              let id = cell._cell.row.data?._id;
              this.router.navigateByUrl('/course/' + id);
            }
          },
        },
        { title: 'Sr. No.', field: 'srNo', sorter: 'number', width: 200 },
        { title: 'Course Name', field: 'name', sorter: 'string' },
        { title: 'Category', field: 'category', sorter: 'string' },
        { title: 'Sub Category', field: 'subCategory', sorter: 'string' },
        { title: 'Price', field: 'price', sorter: 'string' },
        { title: 'Date of Course Add', field: 'createdAt', sorter: 'string' },
      ],
    });

    this.getCollageList();

    this.getCourseTabListingDetail();
  }

  addNewCourse() {
    this.router.navigateByUrl(this.httpService.userRole + '/addCourse');
  }

  getCourseTabListingDetail() {
    this.httpService.spinner.show();
    let ajaxParams = { search: this.searchFilter };
    this.httpService.ajaxConfig.headers.Authorization =
      this.httpService.getToken('accessToken');
    this.courseTbl.setData(
      this.httpService.wshost + 'employee/course/list/' + this.id,
      ajaxParams,
      this.httpService.ajaxConfig
    );
  }

  clear(call: any) {
    this.searchFilter = '';
    this.selectedClg = null;
    if (call == 'Y') this.getCourseTabListingDetail();
  }

  deleteAlert(courseVal: any) {
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
        this.deleteCourseRecord(courseVal);
      }
    });
  }

  deleteCourseRecord(courseVal: any) {
    if (!this.httpService.checkValNull(courseVal._id)) {
      this.httpService
        .httpRequest(
          'employee/course/' + courseVal._id,
          '',
          'delete',
          false,
          true
        )
        .subscribe((resp) => {
          if (resp.status == 'success' && resp.responseCode == '200') {
            this.httpService.showToastMsgHandler('success', resp.message);
            this.getCourseTabListingDetail();
          }
        });
    }
  }

  getCollageList() {
    this.httpService.spinner.show();
    this.httpService
      .httpRequest('college/list', '', 'get', false, false)
      .subscribe((resp) => {
        if (resp.status == 'success' && resp.responseCode == '200')
          this.collagesList = resp.data?.college?.list;
        this.httpService.spinner.hide();
      });
  }
}
