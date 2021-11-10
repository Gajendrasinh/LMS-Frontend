import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-schedule-webinar',
  templateUrl: './schedule-webinar.component.html',
  styleUrls: ['./schedule-webinar.component.scss']
})
export class ScheduleWebinarComponent implements OnInit {

  public webinarForm: FormGroup;

  collageList: any[] = [];
  courseList: any[] = [];
  departMentList: any[] = [];

  constructor(public formBuilder: FormBuilder,
    private router: Router, public httpService: HttpService) { }

  ngOnInit(): void {
    this.webinarForm = this.formBuilder.group({
      name: new FormControl(
        "",
        Validators.compose([
          Validators.required
        ])
      ),
      password: new FormControl(""),
      time: new FormControl("", Validators.required),
      college: new FormControl(null, Validators.required),
      departement: new FormControl(null, Validators.required),
      course: new FormControl(null, Validators.required),
      url: new FormControl("", Validators.required),
    });

    if (this.httpService.accessToken == undefined || this.httpService.accessToken == null) {
      this.router.navigateByUrl('/login');
    } else {
      this.getCollageList();
    }
  }

  addNewWebinar(val: any) {
    this.httpService.spinner.show();

    let addWebinar = {};
    addWebinar['name'] = val.name ? val.name : '';
    addWebinar['personname'] = val.personname ? val.personname : '';
    addWebinar['password'] = val.password ? val.password : '';
    addWebinar['time'] = val.time ? val.time : '';
    addWebinar['url'] = val.url ? val.url : '';
    addWebinar['college'] = val.college  ? val.college  : '';
    addWebinar['course'] = val.course ? val.course : '';
    addWebinar['departement'] = val.departement ? val.departement : '';


    this.httpService.httpRequest("employee/webinar/add", addWebinar, "post", false, true).subscribe((resp) => {
      if (resp.status == "success" && resp.responseCode == "200") {
        this.router.navigateByUrl(this.httpService.userRole + '/webinarList');
      } 
      this.httpService.spinner.hide();
    })
  }

  allWebinarListing() {
    this.router.navigateByUrl(this.httpService.userRole + '/webinarList');
  }

  getCollageList() {
    this.httpService.spinner.show();
    this.httpService.httpRequest("college/list", "", "get", false, true).subscribe((resp) => {
      if (resp.status == "success" && resp.responseCode == "200") {
        this.collageList = resp.data?.college?.list;
        this.webinarForm.get('college').patchValue(this.httpService.userDetail?._id);
        this.webinarForm.get('college').disabled;
        this.getDepartMentList(this.collageList, this.webinarForm.value)
        this.getCourseList();
      }
      this.httpService.spinner.hide();
    })
  }

  getCourseList() {
    this.httpService.spinner.show();
    this.httpService.httpRequest("college/courses", "", "get", false, true).subscribe((resp) => {
      if (resp.status == "success" && resp.responseCode == "200") {
        this.courseList = resp.data?.list;
      }
      this.httpService.spinner.hide();
    })
  }

  getDepartMentList(clgList: any, formVal: any) {
    this.departMentList = [];
    clgList.forEach(clg => {
      if (clg._id == formVal.college)  this.departMentList = clg.department;
    });
  }

}
