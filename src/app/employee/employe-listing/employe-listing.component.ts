import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddRecordsPopupComponent } from 'src/app/common/add-records-popup/add-records-popup.component';
import { CommonAlertComponent } from 'src/app/common/common-alert/common-alert.component';
import { HttpService } from 'src/app/service/http.service';
import Tabulator from 'tabulator-tables';

@Component({
  selector: 'app-employe-listing',
  templateUrl: './employe-listing.component.html',
  styleUrls: ['./employe-listing.component.scss']
})
export class EmployeListingComponent implements OnInit {
  filterType: any = "";
  searchFilter: any = "";
  atozFilter: any = "";
  departmentFilter: any = "";
  dojFilter: any = "";
  totalStudentCount: any = 0;
  empTbl: any;

  perpage: any = '10';
  pageNumber: any = '1';

  studentTabListing: any[] = [];
  departmentList: any[] = [];

  constructor(public formBuilder: FormBuilder,
    private router: Router, public httpService: HttpService, public modelService: NgbModal) { }

  ngOnInit(): void {

    this.empTbl = new Tabulator("#student-table", {
      height: "100%",
      layout: "fitColumns",
      columnHeaderVertAlign: "bottom",
      pagination: "remote",
      paginationSize: 10,
      tooltipGenerationMode: "hover",
      paginationSizeSelector: [10, 100, 500, 1000],
      movableColumns: true,
      responsiveLayout: true,
      placeholder: "No records found.",
      headerFilterPlaceholder: "",
      ajaxFiltering: false,
      ajaxLoader: false,
      tooltipsHeader: true,
      ajaxRequesting: (url: any, params: any) => {
        if (params != undefined && params.pageNo != undefined && params.recPerPage != undefined) {
          this.perpage = params.recPerPage;
          this.pageNumber = params.pageNo;
          this.getEmpTabListingDetail();
        }
      },
      ajaxError: (error: any) => {
        this.httpService.spinner.hide();
      },
      ajxResponse: (url:any, parms: any, reposnse: any) => {
      },
      ajaxContentType: "json",
      paginationDataSent: {
        "page": "currPage",
        "size": "recPerPage"
      },
      columns: [
        { formatter: "rowSelection", titleFormatter: "rowSelection", align: "center", headerSort: false, width: 50 },
        {
          title: "Action", formatter: this.httpService.actionBox, align: "center", width: 75, headerSort: false, cellClick: (e: any, cell: any) => {
            if (e.target.id == "edit") {
              let id = cell._cell.row.data?._id;
              this.httpService.tempStdEditDetail = cell._cell.row.data;
              this.router.navigateByUrl("/employee/editStudent/" + id);
            } else if (e.target.id == "delete") {
              this.deleteAlert(cell._cell.row.data);
            }
          }
        },
        { title: "Sr. No.", field: "srNo", sorter: "number", width: 100 },
        { title: "Student Id", field: "_id", sorter: "string" },
        { title: "First Name", field: "firstname", sorter: "string" },
        { title: "Last Name", field: "lastname", sorter: "string" },
        { title: "Email Id", field: "email", sorter: "string" },
        { title: "Department Name", field: "coursename", sorter: "string" },
        { title: "Date of joing", field: "dateofjoining", sorter: "string" }
      ],
    });

    // this.getDepartment();
    this.getEmpTabListingDetail();

  }

  filterChange(val) {
    this.clearFilter('N');
    this.filterType = val;
  }

  getEmpTabListingDetail() {
    this.httpService.spinner.show();
    let queryString = '?search=' + this.searchFilter + '&department=' + this.departmentFilter + '&dateOfJoining=' + this.httpService.changeDateFilter(this.dojFilter) + '&perPage=' + this.perpage + '&pageNumber=' + this.pageNumber;
    this.httpService.httpRequest("student/list" + queryString, "", "get", false, true).subscribe((resp) => {
      if (resp.status == "success" && resp.responseCode == "200") {
        this.studentTabListing = [];
        let count = 1;
        resp.data?.students?.list.forEach(item => {
          item["srNo"] = count;
          this.studentTabListing.push(item);
          count = count + 1;
        });
        this.totalStudentCount = this.studentTabListing.length;
        this.httpService.getPageInfo(this.empTbl.element.id, this.perpage, this.pageNumber, this.totalStudentCount);
        this.empTbl.setData(this.studentTabListing);
      }
      this.httpService.spinner.hide();
    })
  }

  clearFilter(call: any) {
    this.filterType = "";
    this.searchFilter = "";
    this.atozFilter = "";
    this.departmentFilter = "";
    this.dojFilter = "";
    if (call == 'Y') this.getEmpTabListingDetail();
  }

  importModalaPopup() {
    const initialState = {
      title: "Employee"
    }

    const modalRef = this.modelService.open(AddRecordsPopupComponent, { centered: true, backdrop: 'static', keyboard: false })
    modalRef.componentInstance.data = initialState;

    modalRef.result.then((result) => {
      if (result == "single") this.router.navigateByUrl("admin/addEmployee");
      else if (result == "bulk") this.bulkDataUpload();
    })
  }

  bulkDataUpload() {

  }

  exportListData() {
    this.empTbl.download("csv", "studentDetail.csv"); 
  }

  deleteAlert(stdVal: any) {
    const initialState = {
      alertType: "warning",
      msg: "Are you Sure you want to delete?"
    }

    const modalRef = this.modelService.open(CommonAlertComponent, { centered: true, backdrop: 'static', keyboard: false })
    modalRef.componentInstance.data = initialState;

    modalRef.result.then((result) => {
      if (result == "Y") {
        this.deleteStudentRecord(stdVal)
      }
    })
  }

  deleteStudentRecord(stdVal: any) {
    if (!this.httpService.checkValNull(stdVal._id)) {
      this.httpService.httpRequest("student/" + stdVal._id, "", "delete", false, true).subscribe((resp) => {
        if (resp.status == "success" && resp.responseCode == "200") {
          this.httpService.showToastMsgHandler("success", resp.message);
          this.getEmpTabListingDetail();
        }
      })
    }
  }

  bulkDataDelete() {
    if (this.empTbl.getSelectedData().length != 0) {
      let deleteIds: any[] = [];
      this.empTbl.getSelectedData().forEach(item => {
        deleteIds.push(item._id);
      });
      this.httpService.httpRequest("student/bulk/list", { ids: deleteIds }, "delete", false, true).subscribe((resp) => {
        if (resp.status == "success" && resp.responseCode == "200") {
          this.httpService.showToastMsgHandler("success", resp.message);
          this.getEmpTabListingDetail();
        }
      })
    }
  }
}
