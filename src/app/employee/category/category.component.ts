import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/service/http.service';
import Tabulator from 'tabulator-tables';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  categorytable: any;

  constructor(public httpService: HttpService) {}

  ngOnInit(): void {
    this.categorytable = new Tabulator('#categories-table', {
      height: '100%',
      layout: 'fitColumns',
      columnHeaderVertAlign: 'bottom',
      pagination: 'local',
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
      ajaxRequesting: (url: any, params: any) => {},
      ajaxResponse: (url: any, params: any, response: any) => {
        this.httpService.spinner.hide();
        if (response.responseCode == '200') {
          return response.data.list;
        } else {
          return [];
        }
      },
      ajaxError: (error: any) => {
        this.httpService.spinner.hide();
      },
      paginationDataSent: {
        page: 'pageNumber',
        size: 'perPage',
      },
      ajaxContentType: 'json',
      columns: [
        // {
        //   title: 'Action',
        //   formatter: this.httpService.actionBox,
        //   align: 'center',
        //   width: 75,
        //   headerSort: false,
        //   cellClick: (e: any, cell: any) => {
        //     if (e.target.id == 'edit') {
        //       let id = cell._cell.row.data?._id;
        //       this.httpService.tempClgEditDetail = cell._cell.row.data;
        //       // this.router.navigateByUrl(this.httpService.userRole + "/editCollage/" + id);
        //     } else if (e.target.id == 'delete') {
        //       // this.deleteAlert(cell._cell.row.data);
        //     }
        //   },
        // },
        { title: 'Category', field: 'name', sorter: 'number', width: 200 },

        { title: 'Created At', field: 'createdAt', sorter: 'string' },
        // { title: 'Sub Category', field: 'subCategory', sorter: 'string' },
      ],
    });

    this.loadData();
  }

  loadData() {
    this.httpService.spinner.show();
    this.httpService.ajaxConfig.headers.Authorization =
      this.httpService.getToken('accessToken');
    this.categorytable.setData(
      this.httpService.wshost + 'admin/category/list?value=names',
      '',
      this.httpService.ajaxConfig
    );
  }
}
