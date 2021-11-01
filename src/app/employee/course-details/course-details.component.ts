import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/service/http.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss'],
})
export class CourseDetailsComponent implements OnInit {
  isFirstOpen :boolean= true;
  isCourseDetail :boolean= false;
  course: any = {};

  constructor(
    private router: Router,
    public httpService: HttpService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if(this.router.url.startsWith("/" + this.httpService.userRole + "/courseDetail")){
      this.isCourseDetail = true;
    }

    this.activatedRoute.params.subscribe((prm) => {
      this.httpService.spinner.show();

      this.httpService
        .httpRequest('employee/course/' + prm['id'], '', 'get', false, true)
        .subscribe((resp) => {
          if (resp.status == 'success') {
            this.course = resp.data.detail;
          } else {
            this.course = {};
          }
          this.httpService.spinner.hide();
        });
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
}
