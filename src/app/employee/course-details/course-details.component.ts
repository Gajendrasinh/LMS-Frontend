import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/service/http.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss'],
})
export class CourseDetailsComponent implements OnInit {

  isFirstOpen: boolean = true;
  isCourseDetail: boolean = false;
  couserSubId: any;
  course: any = {};
  relaventCourseList: any[] = []

  constructor(
    private router: Router,
    public httpService: HttpService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    if (this.router.url.startsWith("/" + this.httpService.userRole + "/courseDetail")) {
      this.isCourseDetail = true;
    }

    this.activatedRoute.params.subscribe((prm) => {
      this.couserSubId = prm['id']
      this.getSubIdCourseDetail(this.couserSubId);
    });
    this.httpService.spinner.show();


  }

  getSubIdCourseDetail(id) {
    this.httpService.httpRequest('employee/course/' + id, '', 'get', false, true).subscribe((resp) => {
      if (resp.status == 'success') {
        this.course = resp.data.detail;
        if (resp.data.detail?.category) this.getReleventCouseDetail(resp.data.detail?.category);
      } else {
        this.course = {};
      }
      this.httpService.spinner.hide();
    });
  }

  enrolleNow(id: any) {
    this.httpService
      .httpRequest('student/course/enrolle/' + id, '', 'get', false, true)
      .subscribe((resp) => {
        if (resp.status == 'success') {
          this.router.navigateByUrl('/student/course');
        }
        this.httpService.spinner.hide();
      });
  }

  getReleventCouseDetail(id: any) {
    this.httpService.httpRequest('employee/course/list/' + id + '?search=&pageNumber=1&perPage=10', '', 'get', false, true).subscribe((resp) => {
      if (resp.status == 'success') {
        if (resp.data.course?.list) {
          resp.data.course?.list.forEach(item => { if (item.subCategory != this.couserSubId) this.relaventCourseList.push(item); });
        }
      } else {
        this.relaventCourseList = [];
      }
      this.httpService.spinner.hide();
    });
  }

  viewRelaventCouse(course: any) {
    this.router.navigateByUrl('/course/' + course._id);
  }
}
