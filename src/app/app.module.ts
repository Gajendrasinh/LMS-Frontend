import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { NgxEditorModule } from 'ngx-editor';

import { HttpService } from './service/http.service';

import { LoginComponent } from './login/login.component';
import { SideMenuHeaderComponent } from './side-menu-header/side-menu-header.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { EmpDashboardComponent } from './employee/emp-dashboard/emp-dashboard.component';
import { ScheduleWebinarComponent } from './employee/schedule-webinar/schedule-webinar.component';
import { WebinarListingComponent } from './employee/webinar-listing/webinar-listing.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AddNewCouresComponent } from './employee/add-new-coures/add-new-coures.component';
import { AddNewClgComponent } from './employee/add-new-clg/add-new-clg.component';
import { AddNewStudentDetailComponent } from './employee/add-new-student-detail/add-new-student-detail.component';
import { CourseListingComponent } from './employee/course-listing/course-listing.component';
import { CollageListingComponent } from './employee/collage-listing/collage-listing.component';
import { CommonModule, DatePipe } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { StudentListingComponent } from './employee/student-listing/student-listing.component';
import { AddRecordsPopupComponent } from './common/add-records-popup/add-records-popup.component';
import { CollageDashboardComponent } from './collage/collage-dashboard/collage-dashboard.component';
import { UserDetailComponent } from './common/user-detail/user-detail.component';
import { CommonAlertComponent } from './common/common-alert/common-alert.component';
import { StaffListingComponent } from './collage/staff-listing/staff-listing.component';
import { AddStaffComponent } from './collage/add-staff/add-staff.component';
import { ConductExamComponent } from './collage/conduct-exam/conduct-exam.component';
import { ExamQuestionsComponent } from './collage/exam-questions/exam-questions.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { TutorDashboardComponent } from './tutor/tutor-dashboard/tutor-dashboard.component';
import { TutorAnalysisComponent } from './tutor/tutor-analysis/tutor-analysis.component';
import { TutorAddCourseComponent } from './tutor/tutor-add-course/tutor-add-course.component';
import { TutorCoursListingComponent } from './tutor/tutor-cours-listing/tutor-cours-listing.component';
import { EmployeListingComponent } from './employee/employe-listing/employe-listing.component';
import { AddEditEmployeeComponent } from './employee/add-edit-employee/add-edit-employee.component';
import { StudentDashboardComponent } from './student/student-dashboard/student-dashboard.component';
import { StudentCourseComponent } from './student/student-course/student-course.component';
import { CommonListingTblComponent } from './common/common-listing-tbl/common-listing-tbl.component';
import { EarnedBadgsCertificateComponent } from './student/earned-badgs-certificate/earned-badgs-certificate.component';
import { BulkUploadCsvService } from './service/bulk-upload-csv.service';
import { ExamPaperComponent } from './student/exam-paper/exam-paper.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { CourseByCategoriesComponent } from './employee/course-by-categories/course-by-categories.component';
import { FeedbackComponent } from './common/feedback/feedback.component';
import { CategoryComponent } from './employee/category/category.component';
import { AddCategoryComponent } from './employee/category/add-category/add-category.component';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CourseDetailsComponent } from './employee/course-details/course-details.component';
import { UserPermissionListingComponent } from './employee/user-permission-listing/user-permission-listing.component';
import { AddUpdateUserPermissionComponent } from './employee/user-permission-listing/add-update-user-permission/add-update-user-permission.component';
import { ForgetPasswordPopupComponent } from './login/forget-password-popup/forget-password-popup.component';
import { AddUpdateModuleComponent } from './employee/module-listing/add-update-module/add-update-module.component';
import { ModuleListingComponent } from './employee/module-listing/module-listing.component';
import { ExamPaperCheckComponent } from './collage/exam-paper-check/exam-paper-check.component';
import { StudentCourseDetailsComponent } from './student/student-course-details/student-course-details.component';
import { VideoWatchPopupComponent } from './video-watch-popup/video-watch-popup.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SideMenuHeaderComponent,
    EmpDashboardComponent,
    ScheduleWebinarComponent,
    WebinarListingComponent,
    UserProfileComponent,
    UserDetailComponent,
    AddNewCouresComponent,
    AddNewClgComponent,
    AddNewStudentDetailComponent,
    PageNotFoundComponent,
    CourseListingComponent,
    StudentListingComponent,
    CollageListingComponent,
    AddRecordsPopupComponent,
    CollageDashboardComponent,
    CommonAlertComponent,
    StaffListingComponent,
    AddStaffComponent,
    ConductExamComponent,
    ExamQuestionsComponent,
    TutorDashboardComponent,
    TutorAnalysisComponent,
    TutorCoursListingComponent,
    TutorAddCourseComponent,
    EmployeListingComponent,
    AddEditEmployeeComponent,
    StudentDashboardComponent,
    StudentCourseComponent,
    CommonListingTblComponent,
    EarnedBadgsCertificateComponent,
    ExamPaperComponent,
    CourseDetailsComponent,
    CourseByCategoriesComponent,
    FeedbackComponent,
    CategoryComponent,
    AddCategoryComponent,
    CourseDetailsComponent,
    UserPermissionListingComponent,
    AddUpdateUserPermissionComponent,
    ForgetPasswordPopupComponent,
    ModuleListingComponent,
    AddUpdateModuleComponent,
    ExamPaperCheckComponent,
    StudentCourseDetailsComponent,
    VideoWatchPopupComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgSelectModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    NgxSpinnerModule,
    NgxMaterialTimepickerModule,
    NgxEditorModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
      progressAnimation: 'decreasing',
    }),
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    NgxEditorModule,
    AccordionModule.forRoot(),
  ],
  entryComponents: [AddRecordsPopupComponent, CommonAlertComponent, ForgetPasswordPopupComponent, AddUpdateUserPermissionComponent, AddUpdateModuleComponent,VideoWatchPopupComponent],
  providers: [HttpService, BulkUploadCsvService, DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule { }
