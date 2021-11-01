import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from 'src/app/service/http.service';
import Tabulator from 'tabulator-tables';
import { AddUpdateUserPermissionComponent } from './add-update-user-permission/add-update-user-permission.component';

@Component({
  selector: 'app-user-permission-listing',
  templateUrl: './user-permission-listing.component.html',
  styleUrls: ['./user-permission-listing.component.scss']
})
export class UserPermissionListingComponent implements OnInit {

  userList: any[] = [];
  userTbl: any;

  constructor(public httpService: HttpService, public modelService: NgbModal) { }

  ngOnInit(): void {
    this.setUserTbl();
    this.getUserList();
  }

  addNewModule() {
    this.permissionPage("add");
  }

  setUserTbl() {
    this.userTbl = new Tabulator("#user-permission-table", {
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
          this.getUserList();
        }
      },
      ajaxResponse: (url: any, params: any, response: any) => {
        this.userList = [];
        this.httpService.spinner.hide();
        if (response.status == 'success' && response.responseCode == '200') {
          let _lastPage = Math.ceil(response.data.students.totalLength / parseInt(this.userTbl.getPageSize()));
          let count = 1;
          response.data.students.list.forEach(item => {
            item["srNo"] = count;
            this.userList.push(item);
            count = count + 1;
          })
          let data = { last_page: _lastPage, data: this.userList, };
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
              this.permissionPage("edit", cell._cell.row.data);
            }
          }
        },
        { title: "Sr. No.", field: "srNo", sorter: "number", width: 100 },
        { title: "User Name", field: "name", sorter: "string" },
        { title: "Role", field: "time", sorter: "string" },
        { title: "Page Permission", field: "time", sorter: "string" },
      ],
    });
  }

  getUserList() {
    this.httpService.spinner.show();
    this.httpService.ajaxConfig.headers.Authorization = this.httpService.getToken('accessToken')
    this.userTbl.setData(this.httpService.wshost + 'student/list', "", this.httpService.ajaxConfig);
  }

  permissionPage(title: any, value?: any) {
    const initialState = {
      title: title,
      value: value
    }

    const modalRef = this.modelService.open(AddUpdateUserPermissionComponent, { centered: true, backdrop: 'static', keyboard: false })
    modalRef.componentInstance.data = initialState;

    modalRef.result.then((result) => {
      if (result == "Y") {
      }
    })
  }


}
