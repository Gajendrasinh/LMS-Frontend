import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-course-by-categories',
  templateUrl: './course-by-categories.component.html',
  styleUrls: ['./course-by-categories.component.scss'],
})
export class CourseByCategoriesComponent implements OnInit {
  categories: any = [];

  constructor(public httpService: HttpService) {}

  ngOnInit(): void {
    this.getCategory();
  }

  getCategory() {
    this.httpService.spinner.show();
    this.httpService
      .httpRequest('admin/category/list?value=names', '', 'get', false, true)
      .subscribe((resp) => {
        if (resp.status == 'success' && resp.responseCode == '200') {
          this.categories = resp.data.list;
        } else {
          this.categories = [];
        }
        this.httpService.spinner.hide();
      });
  }
}
