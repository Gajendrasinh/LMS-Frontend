import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddRecordsPopupComponent } from 'src/app/common/add-records-popup/add-records-popup.component';
import { CommonAlertComponent } from 'src/app/common/common-alert/common-alert.component';
import { HttpService } from 'src/app/service/http.service';
import Tabulator from 'tabulator-tables';

@Component({
  selector: 'app-collage-listing',
  templateUrl: './collage-listing.component.html',
  styleUrls: ['./collage-listing.component.scss']
})
export class CollageListingComponent implements OnInit {

  searchFilter: any = "";
  perpage: any = '10';
  pageNumber: any = '1';

  totalCollageCount: any = 0;
  collageTbl: any;
  collageTblList: any[] = [];

  constructor(public formBuilder: FormBuilder,
    private router: Router, public httpService: HttpService, public modelService: NgbModal) { }

  ngOnInit(): void {

    if (this.httpService.accessToken == undefined || this.httpService.accessToken == null) {
      this.router.navigateByUrl('/login');

    } else {


      this.collageTbl = new Tabulator("#collage-table", {
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
            this.getCollageTabListingDetail();
          }
        },
        ajaxResponse: (url: any, params: any, response: any) => {
          this.collageTblList = [];
          this.httpService.spinner.hide();
          if (response.status == 'success' && response.responseCode == '200') {
            let _lastPage = Math.ceil(response.data.college.totalLength / parseInt(this.collageTbl.getPageSize()));
            let count = 1;
            response.data?.college?.list.forEach(item => {
              item["srNo"] = count;
              this.collageTblList.push(item);
              count = count + 1;
            });
            this.totalCollageCount = response.data?.college?.totalLength;
            // this.httpService.getPageInfo(this.collageTbl.element.id, this.perpage, this.pageNumber, this.totalCollageCount);
            let data = { last_page: _lastPage, data: this.collageTblList, };
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
          { formatter: "rowSelection", titleFormatter: "rowSelection", align: "center", headerSort: false, width: 50 },
          {
            title: "Action", formatter: this.httpService.actionBox, align: "center", width: 75, headerSort: false, cellClick: (e: any, cell: any) => {
              if (e.target.id == "edit") {
                let id = cell._cell.row.data?._id;
                this.httpService.tempClgEditDetail = cell._cell.row.data;
                this.router.navigateByUrl(this.httpService.userRole + "/editCollage/" + id);
              } else if (e.target.id == "delete") {
                this.deleteAlert(cell._cell.row.data);
              }
            }
          },
          { title: "Sr. No.", field: "srNo", sorter: "number", width: 200 },
          { title: "Collage Name", field: "name", sorter: "string" },
          { title: "Location", field: "address", sorter: "string" },
          { title: "Date of joining", field: "createdAt", sorter: "string" },
          { title: "Collage Id", field: "_id", sorter: "string" }
        ],
      });
      this.getCollageTabListingDetail();
    }

  }

  addNewCollage() {
    this.router.navigateByUrl(this.httpService.userRole + "/addCollage");
  }

  getCollageTabListingDetail() {
    this.httpService.spinner.show();
    let ajaxParams = { search: this.searchFilter };
    this.httpService.ajaxConfig.headers.Authorization = this.httpService.getToken('accessToken')
    this.collageTbl.setData(this.httpService.wshost + 'college/list', ajaxParams, this.httpService.ajaxConfig);
  }

  clear(call: any) {
    this.searchFilter = "";
    if (call == 'Y') this.getCollageTabListingDetail();
  }

  importModalaPopup() {
    const initialState = {
      title: "Collage"
    }
    const modalRef = this.modelService.open(AddRecordsPopupComponent, { centered: true, backdrop: 'static', keyboard: false })
    modalRef.componentInstance.data = initialState;

    modalRef.result.then((result) => {
      if (result.type == "single") this.router.navigateByUrl("employee/addCollage");
      else if (result.type == "bulk") this.bulkDataUpload(result.list);
    })
  }

  bulkDataUpload(list: any) {
    if (list.arrObj != undefined && list.arrObj.length > 0) {
      this.httpService.httpRequest("college/bulk/upload", { colleges: list.arrObj }, "post", false, true).subscribe((resp) => {
        if (resp.status == "success" && resp.responseCode == "200") {
          this.httpService.showToastMsgHandler("success", resp.colleges.message);
          this.getCollageTabListingDetail();
        }
      })
    } else {
      this.httpService.showToastMsgHandler("warning", "Please Try again someting wrong");
    }
  }

  bulkDataDelete() {
    if (this.collageTbl.getSelectedData().length != 0) {
      let deleteIds: any[] = [];
      this.collageTbl.getSelectedData().forEach(item => {
        deleteIds.push(item._id);
      });
      this.httpService.httpRequest("college/bulk/list", { ids: deleteIds }, "delete", false, true).subscribe((resp) => {
        if (resp.status == "success" && resp.responseCode == "200") {
          this.httpService.showToastMsgHandler("success", resp.data.message);
          this.getCollageTabListingDetail();
        }
      })
    }
  }

  exportListData() {
    this.collageTbl.download("csv", "collageDetail.csv");
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
      let url = 'college/' + clgId + '/staff/' + staffVal._id;
      this.httpService.httpRequest(url, "", "delete", false, true).subscribe((resp) => {
        if (resp.status == "success" && resp.responseCode == "200") {
          this.httpService.showToastMsgHandler("success", resp.message);
          this.getCollageTabListingDetail();
        }
      })
    }
  }

}
