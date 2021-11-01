import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-student-course',
  templateUrl: './student-course.component.html',
  styleUrls: ['./student-course.component.scss']
})
export class StudentCourseComponent implements OnInit {

  title: any = "";
  courseList: any[] = [];

  constructor(public router: Router, public httpService: HttpService) { }

  ngOnChanges() {
  }

  ngOnInit(): void {
    if (this.router.url.startsWith("/student/course")) {
      this.title = "My course";
    } else if (this.router.url.startsWith("/student/otherCourse")) {
      this.title = "Other Course";
    }
    this.getCourseList();
  }

  getCourseList() {
    let url;
    if (this.title == 'My course') url = "student/list/mycourse";
    else url = "tutor/tutorials";
    this.httpService.httpRequest(url, "", "get", false, true).subscribe((resp) => {
      if (resp.status == "success" && resp.responseCode == "200") {
        this.courseList = resp.data.list;
      }
      this.httpService.spinner.hide();
    })
  }

  ngOnDestroy() {
    this.title = "";
    this.courseList = [];
  }

  courseDetail(course: any) {
    if (this.title == 'My course') {
      this.router.navigateByUrl('/student/courseDetail/' + course._id);
    }
  }

}
