import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../service/http.service';

@Component({
  selector: 'app-side-menu-header',
  templateUrl: './side-menu-header.component.html',
  styleUrls: ['./side-menu-header.component.scss'],
})
export class SideMenuHeaderComponent implements OnInit {
  userUrl: string = '';
  userName: string = '';

  adminModuleSideMenu: any = ([] = [
    {
      menuName: 'Dashboard',
      routeLink: '/admin/dashboard',
      imgFont: './assets/img/dashboard.png',
    },
    {
      menuName: 'Student',
      routeLink: '/admin/studentListing',
      imgFont: './assets/img/menu-reading-book.png',
    },
    {
      menuName: 'Collage',
      routeLink: '/admin/collageListing',
      imgFont: './assets/img/menu-school.png',
    },
    {
      menuName: 'Exam',
      routeLink: '/admin/conductExam',
      imgFont: './assets/img/menu-test.png',
    },
    {
      menuName: 'Staff',
      routeLink: '/admin/staffListing',
      imgFont: './assets/img/menu-team.png',
    },
    // { menuName: "Employee", routeLink: "/admin/employeeListing", imgFont: "./assets/img/menu-employee.png" },
    {
      menuName: 'Webinar',
      routeLink: '/admin/setwebinar',
      imgFont: './assets/img/menu-webinar.png',
    } ,
    {
      menuName: 'Exam Marking',
      routeLink: '/admin/examCheck',
      imgFont: './assets/img/menu-test.png',
    },
  ]);
  // ,
  //   { menuName: "File Bank", routeLink: "/admin/dashboard", imgFont: "./assets/img/menu-files.png" },
  //   { menuName: "Analysis", routeLink: "/admin/dashboard", imgFont: "./assets/img/menu-analytics.png" },
  //   { menuName: "Package", routeLink: "/employee/dashboard", imgFont: "./assets/img/menu-box.png" }

  empModuleSideMenu: any = ([] = [
    {
      menuName: 'Dashboard',
      routeLink: '/employee/dashboard',
      imgFont: './assets/img/dashboard.png',
    },
    {
      menuName: 'Webinar',
      routeLink: '/employee/setwebinar',
      imgFont: './assets/img/menu-webinar.png',
    },
    {
      menuName: 'File Bank',
      routeLink: '/employee/dashboard',
      imgFont: './assets/img/menu-files.png',
    },
    {
      menuName: 'Analysis',
      routeLink: '/employee/dashboard',
      imgFont: './assets/img/menu-analytics.png',
    },
    {
      menuName: 'Package',
      routeLink: '/employee/dashboard',
      imgFont: './assets/img/menu-box.png',
    },
    {
      menuName: 'Exam Marking',
      routeLink: '/employee/examCheck',
      imgFont: './assets/img/menu-test.png',
    },
  ]);

  clgModuleSideMenu: any = ([] = [
    {
      menuName: 'Dashboard',
      routeLink: '/college/dashboard',
      imgFont: './assets/img/dashboard.png',
    },
    {
      menuName: 'Webinar',
      routeLink: '/college/setwebinar',
      imgFont: './assets/img/menu-webinar.png',
    },
    {
      menuName: 'Exam',
      routeLink: '/college/conductExam',
      imgFont: './assets/img/menu-test.png',
    },
    {
      menuName: 'Courses',
      routeLink: '/college/courses/by-categories',
      imgFont: './assets/img/menu-academic.png',
    },
    {
      menuName: 'Staff',
      routeLink: '/college/staffListing',
      imgFont: './assets/img/menu-box.png',
    },
    {
      menuName: 'Exam Marking',
      routeLink: '/college/examCheck',
      imgFont: './assets/img/menu-test.png',
    },
  ]);

  tutorModuleSideMenu: any = ([] = [
    {
      menuName: 'Dashboard',
      routeLink: '/staff/dashboard',
      imgFont: './assets/img/dashboard.png',
    },
    {
      menuName: 'Courses',
      routeLink: '/staff/courses/by-categories',
      imgFont: './assets/img/menu-academic.png',
    },
    {
      menuName: 'Analysis',
      routeLink: '/staff/analysia',
      imgFont: './assets/img/menu-analytics.png',
    },
    {
      menuName: 'Package',
      routeLink: '/staff/dashboard',
      imgFont: './assets/img/menu-box.png',
    },
  ]);

  studentSideMenu: any[] = [
    {
      menuName: 'Dashboard',
      routeLink: '/student/dashboard',
      imgFont: './assets/img/dashboard.png',
    },
    {
      menuName: 'Courses',
      routeLink: '/student/course',
      imgFont: './assets/img/menu-academic.png',
    },
    {
      menuName: 'Other Courses',
      routeLink: '/student/courses/by-categories',
      imgFont: './assets/img/menu-online-course.png',
    },
    {
      menuName: 'Test',
      routeLink: '/student/upCommingTest',
      imgFont: './assets/img/menu-group.png',
    },
    {
      menuName: 'Webinar',
      routeLink: '/student/upCommingWebinar',
      imgFont: './assets/img/menu-webinar.png',
    },
    {
      menuName: 'Document',
      routeLink: '/student/documentFile',
      imgFont: './assets/img/menu-certification.png',
    },
    {
      menuName: 'Badges',
      routeLink: '/student/earnedBadges',
      imgFont: './assets/img/menu-ribbon.png',
    },
    {
      menuName: 'Certificate',
      routeLink: '/student/certificateEarned',
      imgFont: './assets/img/menu-certification.png',
    },
  ];

  constructor(private router: Router, public httpService: HttpService) {
    this.httpService.isChangeLoginEmit.subscribe((userDetail: any) => {
      if (userDetail != null && userDetail != undefined) {
        this.userUrl =
          this.httpService.userDetail.logo != undefined &&
          this.httpService.userDetail.logo != ''
            ? this.httpService.filePath + this.httpService.userDetail.logo
            : '../../assets/img/user1.png';
        this.httpService.isShowMenu = true;
        if (userDetail.name != undefined && userDetail.name != null) {
          this.userName = userDetail.name;
        } else if (
          userDetail.firstname != undefined &&
          userDetail.firstname != null &&
          userDetail.lastname != undefined &&
          userDetail.lastname != null
        ) {
          this.userName = userDetail?.firstname + ' ' + userDetail?.lastname;
        }
      }
    });
  }

  ngOnInit(): void {}

  logout() {
    this.httpService.setTokenNull();
    this.router.navigateByUrl('login');
  }
}
