import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as $ from 'jquery';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  wshost: any;
  accessToken: any;
  userDetail: any;
  userRole: any = '';
  filePath: any = 'http://lmsapi.hackdrip.com:8000/upload/file?path=';
  bsConfig: any = {
    dateInputFormat: 'MM/DD/YYYY',
    containerClass: 'theme-dark-blue',
  };

  ajaxConfig: any = {};

  tempStdEditDetail: any = '';
  tempClgEditDetail: any = '';
  tempCourseEditDetail: any = '';
  tempStaffEditDetail: any = '';
  tempExamDetailDetail: any = '';
  tempExamMarkingDetail: any = '';

  isShowMenu: boolean = false;

  actionBox = (cell: any) => {
    return (
      '<i class="pl-1 fa fa-pencil-square-o action-btn" aria-hidden="true" title="edit" id="edit"></i>' +
      '<i class="pl-1 fa fa-trash-o action-btn" aria-hidden="true" title="delete" id="delete"></i>'
    );
  };

  actionBoxwithView = (cell: any) => {
    return (
      '<i class="pl-1 fa fa-pencil-square-o action-btn" aria-hidden="true" title="edit" id="edit"></i>' +
      '<i class="pl-1 fa fa-trash-o action-btn" aria-hidden="true" title="delete" id="delete"></i>' +
      '<i class="pl-1 fa fa-eye action-btn" aria-hidden="true" title="view" id="view"></i>'
    );
  };

  viewbutton = (cell: any) => {
    return '<i class="pl-1 fa fa-eye action-btn" aria-hidden="true" title="view" id="view"></i>';
  };

  editAction = (cell: any) => {
    return '<i class="pl-1 fa fa-pencil-square-o action-btn" aria-hidden="true" title="edit" id="edit"></i>';
  };

  examActionBox = (cell: any) => {
    return (
      '<i class="pl-1 fa fa-eye action-btn" aria-hidden="true" title="view" id="view"></i>' +
      '<i class="pl-1 fa fa-pencil-square-o action-btn" aria-hidden="true" title="edit" id="edit"></i>' +
      '<i class="pl-1 fa fa-trash-o action-btn" aria-hidden="true" title="delete" id="delete"></i>'
    );
  };

  isChangeLoginEmit: EventEmitter<any> = new EventEmitter();

  tableConfig: any = {
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
    ajaxRequesting: '',
    ajaxResponse: '',
    ajaxContentType: 'json',
    paginationDataSent: {
      page: 'pageNumber',
      size: 'perPage',
    },
    ajaxError: '',
    columns: []
  }

  constructor(
    public _http: HttpClient,
    public spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    public datePipe: DatePipe
  ) {
    this.wshost = 'http://lmsapi.hackdrip.com:8000/';

    this.ajaxConfig = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    };
  }

  httpRequest(
    url: any,
    data: any,
    method: any,
    isFormData: boolean,
    isAuthTokenReq: boolean
  ) {
    let httpOptions: any;

    if (isFormData == false) {
      if (isAuthTokenReq) {
        httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: this.accessToken,
          }),
        };
      } else {
        httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Accept: 'application/json',
          }),
        };
      }
    } else {
      if (isAuthTokenReq) {
        httpOptions = {
          headers: new HttpHeaders({
            Authorization: this.accessToken,
            enctype: 'multipart/form-data; boundary=Myboundary',
          }),
        };
      } else {
        httpOptions = {
          headers: new HttpHeaders({
            enctype: 'multipart/form-data; boundary=Myboundary',
          }),
        };
      }
    }

    if (method == 'post') {
      return this._http.post<any>(this.wshost + url, data, httpOptions).pipe(
        map((data: any) => {
          return data;
        }),
        catchError((error) => {
          this.errorHandlers('', error.error.message);
          return throwError(error);
        })
      );
    } else if (method == 'get') {
      return this._http.get<any>(this.wshost + url, httpOptions).pipe(
        map((data: any) => {
          return data;
        }),
        catchError((error) => {
          this.errorHandlers('', error.error.message);
          return throwError(error);
        })
      );
    } else if (method == 'put') {
      return this._http.put(this.wshost + url, data, httpOptions).pipe(
        map((data: any) => {
          return data;
        }),
        catchError((error) => {
          this.errorHandlers('', error.error.message);
          return throwError(error);
        })
      );
    } else if (method == 'delete') {
      if (data != null && data != undefined && data != '')
        httpOptions['body'] = data;
      return this._http.delete(this.wshost + url, httpOptions).pipe(
        map((data: any) => {
          return data;
        }),
        catchError((error) => {
          this.errorHandlers('', error.error.message);
          return throwError(error);
        })
      );
    }
  }

  async errorHandlers(type: any, err: any) {
    this.spinner.hide();
    this.showToastMsgHandler(type, err);
  }

  showToastMsgHandler(type: any, msg: any) {
    this.spinner.hide();
    if (type == 'error')
      this.toastrService.error(
        '',
        msg != undefined && msg != '' ? msg : 'Something wrong please try again'
      );
    else if (type == 'success') this.toastrService.success('', msg);
    else if (type == 'warning')
      this.toastrService.warning(
        '',
        msg != undefined && msg != '' ? msg : 'Something wrong please try again'
      );
    else
      this.toastrService.info(
        '',
        msg != undefined && msg != '' ? msg : 'Something wrong please try again'
      );
  }

  setLocalVal(tokenName: any, data: any) {
    localStorage.setItem(tokenName, JSON.stringify(data));
  }

  getToken(tokenName: any) {
    return JSON.parse(localStorage.getItem(tokenName));
  }

  checkValNull(val: any) {
    if (val == null || val == '' || val == undefined) return true;
    else return false;
  }

  checkValeNotNull(val: any) {
    if (val != null && val != '' && val != undefined) return true;
    else return false;
  }

  changeDateFilter(date: any) {
    if (date != undefined && date != '' && date != null)
      return this.datePipe.transform(new Date(date), 'dd/MM/yyyy');
    else return '';
  }

  setTokenNull() {
    this.accessToken = '';
    this.userDetail = '';
    this.userRole = '';
    this.isShowMenu = false;
    localStorage.clear();
  }

  getPageInfo(tblId: any, pageSize: any, pageNo: any, totalRc: any) {
    var count = pageSize * pageNo;

    if (totalRc > 10) {
      if (pageSize * pageNo > totalRc) {
        count = totalRc;
      } else {
        count = pageSize * pageNo;
      }
    } else {
      count = totalRc;
    }

    let showFrom = 0;
    let showTo = 0;

    if (totalRc > 0) {
      showFrom = (pageNo - 1) * pageSize + 1;
      showTo = showFrom + (pageSize - 1);
    }

    if (showTo > totalRc) {
      showTo = totalRc;
    }

    let _pagetext = 'Showing ' + showFrom + ' to ' + showTo + ' of ' + totalRc;

    $('#' + tblId + ' > .tabulator-footer > .page-info').remove();
    $('#' + tblId + ' > .tabulator-footer').prepend(
      "<span class='page-info'></span>"
    );
    $('#' + tblId + ' > .tabulator-footer > .page-info').text(_pagetext);
  }
}
