import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddRecordsPopupComponent } from 'src/app/common/add-records-popup/add-records-popup.component';
import { CommonAlertComponent } from 'src/app/common/common-alert/common-alert.component';
import { HttpService } from 'src/app/service/http.service';
import Tabulator from 'tabulator-tables';

@Component({
  selector: 'app-tutor-cours-listing',
  templateUrl: './tutor-cours-listing.component.html',
  styleUrls: ['./tutor-cours-listing.component.scss']
})
export class TutorCoursListingComponent implements OnInit {

  filterType: any = "";
  searchFilter: any = "";
  atozFilter: any = "";
  departmentFilter: any = "";
  dojFilter: any = "";
  totalCourseCount: any = 0;
  courseTbl: any;

  perpage: any = '10';
  pageNumber: any = '1';

  courseTabListing: any[] = [];
  departmentList: any[] = [];

  constructor(public formBuilder: FormBuilder,
    private router: Router, public httpService: HttpService, public modelService: NgbModal) { }

  ngOnInit(): void {

    this.courseTbl = new Tabulator("#course-tutor-table", {
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
          this.getTutorCourseTabListingDetail();
        }
      },
      ajaxResponse: (url: any, params: any, response: any) => {
        this.courseTabListing = [];
        this.httpService.spinner.hide();
        if (response.status == 'success' && response.responseCode == '200') {
          let _lastPage = Math.ceil(response.data?.totalLength / parseInt(this.courseTbl.getPageSize()));
          let count = 1;
          if(response.data?.course != undefined){
            response.data?.course.forEach(item => {
              item["srNo"] = count;
              this.courseTabListing.push(item);
              count = count + 1;
            });
          }
          this.totalCourseCount = response?.data?.totalLength;
          let data = { last_page: 0, data: this.courseTabListing, };
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
      columns: [
        {
          title: "Action", formatter: this.httpService.actionBox, align: "center", width: 75, headerSort: false, cellClick: (e: any, cell: any) => {
            if (e.target.id == "edit") {
              let id = cell._cell.row.data?._id;
              this.httpService.tempCourseEditDetail = cell._cell.row.data;
              this.router.navigateByUrl("/staff/editCourse/" + id);
            } else if (e.target.id == "delete") {
              this.deleteAlert(cell._cell.row.data);
            }
          }
        },
        { title: "Sr. No.", field: "srNo", sorter: "number", width: 200 },
        { title: "Course Name", field: "name", sorter: "string" },
        { title: "Date of Course Add", field: "createdAt", sorter: "string" }
      ],
    });

    this.getDepartment();
    this.getTutorCourseTabListingDetail();

  }

  filterChange(val) {
    this.clearFilter('N');
    this.filterType = val;
  }

  getTutorCourseTabListingDetail() {
    this.httpService.spinner.show();
    let ajaxParams = { search: this.searchFilter };
    this.httpService.ajaxConfig.headers.Authorization = this.httpService.getToken('accessToken')
    this.courseTbl.setData(this.httpService.wshost + 'tutor/tutorials', ajaxParams, this.httpService.ajaxConfig);
  }

  clearFilter(call: any) {
    this.filterType = "";
    this.searchFilter = "";
    this.atozFilter = "";
    this.departmentFilter = "";
    this.dojFilter = "";
    if (call == 'Y') this.getTutorCourseTabListingDetail();
  }

  importModalaPopup() {
    const initialState = {
      title: "Course"
    }

    const modalRef = this.modelService.open(AddRecordsPopupComponent, { centered: true, backdrop: 'static', keyboard: false })
    modalRef.componentInstance.data = initialState;

    modalRef.result.then((result) => {
      if (result == "single") this.router.navigateByUrl("staff/addCourse");
      else if (result == "bulk") this.bulkDataUpload();
    })
  }

  bulkDataUpload() {

  }

  exportListData() {
    this.courseTbl.download("csv", "tutorCourseDetails.csv");
  }

  deleteAlert(courseVal: any) {
    const initialState = {
      alertType: "warning",
      msg: "Are you Sure you want to delete?"
    }

    const modalRef = this.modelService.open(CommonAlertComponent, { centered: true, backdrop: 'static', keyboard: false })
    modalRef.componentInstance.data = initialState;

    modalRef.result.then((result) => {
      if (result == "Y") {
        this.deleteCourseRecord(courseVal)
      }
    })
  }

  deleteCourseRecord(courseVal: any) {
    if (!this.httpService.checkValNull(courseVal._id)) {
      this.httpService.httpRequest("tutor/tutorials/" + courseVal._id, "", "delete", false, true).subscribe((resp) => {
        if (resp.status == "success" && resp.responseCode == "200") {
          this.httpService.showToastMsgHandler("success", resp.message);
          this.getTutorCourseTabListingDetail();
        }
      })
    }
  }

  getDepartment() {
    this.httpService.spinner.show();
    let clgId = this.httpService.userRole == 'college' ? this.httpService.userDetail._id : this.httpService.userDetail?.college?._id;
    let urlEndPoint = "college/" + clgId + "/departments"
    this.httpService.httpRequest(urlEndPoint, "", "get", false, true).subscribe((resp) => {
      if (resp.status == "success" && resp.responseCode == "200") this.departmentList = resp.data.departments;
      this.httpService.spinner.hide();
    })
  }

}
