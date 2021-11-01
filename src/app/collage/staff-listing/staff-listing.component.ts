import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddRecordsPopupComponent } from 'src/app/common/add-records-popup/add-records-popup.component';
import { CommonAlertComponent } from 'src/app/common/common-alert/common-alert.component';
import { HttpService } from 'src/app/service/http.service';
import Tabulator from 'tabulator-tables';

@Component({
  selector: 'app-staff-listing',
  templateUrl: './staff-listing.component.html',
  styleUrls: ['./staff-listing.component.scss']
})
export class StaffListingComponent implements OnInit {

  searchFilter: any = "";
  perpage: any = '10';
  pageNumber: any = '1';

  totalStaffCount: any = 0;
  staffTbl: any;
  staffTblList: any[] = [];

  constructor(public formBuilder: FormBuilder,
    private router: Router, public httpService: HttpService, public modelService: NgbModal) { }

  ngOnInit(): void {

    if (this.httpService.accessToken == undefined || this.httpService.accessToken == null) {
      this.router.navigateByUrl('/login');

    } else {
      this.staffTbl = new Tabulator("#staff-table", {
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
            this.getSatffTabListingDetail();
          }
        },
        ajaxResponse: (url: any, params: any, response: any) => {
          this.staffTblList = [];
          this.httpService.spinner.hide();
          if (response.status == 'success' && response.responseCode == '200') {
            let _lastPage = Math.ceil(response.data?.staffs?.totalLength / parseInt(this.staffTbl.getPageSize()));
            let count = 1;
            response.data?.staffs?.list.forEach(item => {
              item["srNo"] = count;
              this.staffTblList.push(item);
              count = count + 1;
            });
            this.totalStaffCount = response.data?.staffs?.totalLength;
            // this.httpService.getPageInfo(this.staffTbl.element.id, this.perpage, this.pageNumber, this.totalStaffCount);
            let data = { last_page: _lastPage, data: this.staffTblList, };
            return data;
          } else {
            let data = { last_page: 0, data: [], };
            return data;
          }
        },
        ajaxError: (error: any) => {
          this.httpService.spinner.hide();
        },
        paginationDataSent: {
          page: 'pageNumber',
          size: 'perPage',
        },
        ajaxContentType: "json",
        columns: [
          {
            title: "Action", formatter: this.httpService.actionBox, align: "center", width: 75, headerSort: false, cellClick: (e: any, cell: any) => {
              if (e.target.id == "edit") {
                let id = cell._cell.row.data?._id;
                this.httpService.tempStaffEditDetail = cell._cell.row.data;
                this.router.navigateByUrl(this.httpService.userRole + "/editStaff/" + id);
              } else if (e.target.id == "delete") {
                this.deleteAlert(cell._cell.row.data);
              }
            }
          },
          { title: "Sr. No.", field: "srNo", sorter: "number", width: 50 },
          { title: "First Name", field: "firstname", sorter: "string" },
          { title: "Last Name", field: "lastname", sorter: "string" },
          { title: "Collage Name", field: "coursename", sorter: "string" },
          { title: "Date of Birth", field: "dob", sorter: "string" },
          { title: "Date of joining", field: "dateofjoining", sorter: "string" }
        ],
      });

      this.getSatffTabListingDetail();

    }

  }

  addNewCollage() {
    this.router.navigateByUrl(this.httpService.userRole + "/addCollage");
  }

  getSatffTabListingDetail() {
    this.httpService.spinner.show();
    let clgId = this.httpService.userRole == 'college' ? this.httpService.userDetail._id : this.httpService.userDetail?.college?._id;
    let ajaxParams = { search: this.searchFilter };
    this.httpService.ajaxConfig.headers.Authorization = this.httpService.getToken('accessToken')
    this.staffTbl.setData(this.httpService.wshost + "college/" + clgId + "/staff/list", ajaxParams, this.httpService.ajaxConfig);
  }

  exportListData() {
    this.staffTbl.download("csv", "staffDetail.csv");
  }


  clear(call: any) {
    this.searchFilter = "";
    if (call == 'Y') this.getSatffTabListingDetail();
  }

  addNewStaff() {
    this.router.navigateByUrl(this.httpService.userRole + "/addNewStaff");
  }

  importModalaPopup() {
    const initialState = {
      title: "Staff"
    }

    const modalRef = this.modelService.open(AddRecordsPopupComponent, { centered: true, backdrop: 'static', keyboard: false })
    modalRef.componentInstance.data = initialState;

    modalRef.result.then((result) => {
      if (result.type == "single") this.router.navigateByUrl(this.httpService.userRole + "/addNewStaff");
      else if (result.type == "bulk") this.bulkDataUpload(result);
    })
  }

  bulkDataUpload(result: any) {
    if (result.list.arrObj != undefined && result.list.arrObj.length > 0 && result.clg != undefined) {
      this.httpService.httpRequest("college/bulk/upload/" + result.clg + "/staff", { staff: result.list.arrObj }, "post", false, true).subscribe((resp) => {
        if (resp.status == "success" && resp.responseCode == "200") {
          this.httpService.showToastMsgHandler("success", resp?.data?.message);
          this.getSatffTabListingDetail();
        }
      })
    } else {
      this.httpService.showToastMsgHandler("warning", "Please Try again someting wrong");
    }
  }

  deleteAlert(staffVal: any) {
    const initialState = {
      alertType: "warning",
      msg: "Are you Sure you want to delete?"
    }

    const modalRef = this.modelService.open(CommonAlertComponent, { centered: true, backdrop: 'static', keyboard: false })
    modalRef.componentInstance.data = initialState;

    modalRef.result.then((result) => {
      if (result == "Y") {
        this.deleteCollageRecord(staffVal)
      }
    })
  }

  deleteCollageRecord(staffVal: any) {
    if (!this.httpService.checkValNull(staffVal._id)) {
      let clgId = this.httpService.userRole == 'college' ? this.httpService.userDetail._id : this.httpService.userDetail?.college?._id;
      this.httpService.httpRequest("college/" + clgId + "/staff/" + staffVal._id, "", "delete", false, true).subscribe((resp) => {
        if (resp.status == "success" && resp.responseCode == "200") {
          this.httpService.showToastMsgHandler("success", resp.message);
          this.getSatffTabListingDetail();
        }
      })
    }
  }
}
