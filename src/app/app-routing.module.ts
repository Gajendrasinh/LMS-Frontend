import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddStaffComponent } from './collage/add-staff/add-staff.component';
import { CollageDashboardComponent } from './collage/collage-dashboard/collage-dashboard.component';
import { ConductExamComponent } from './collage/conduct-exam/conduct-exam.component';
import { ExamQuestionsComponent } from './collage/exam-questions/exam-questions.component';
import { StaffListingComponent } from './collage/staff-listing/staff-listing.component';
import { AddEditEmployeeComponent } from './employee/add-edit-employee/add-edit-employee.component';
import { AddNewClgComponent } from './employee/add-new-clg/add-new-clg.component';
import { AddNewCouresComponent } from './employee/add-new-coures/add-new-coures.component';
import { AddNewStudentDetailComponent } from './employee/add-new-student-detail/add-new-student-detail.component';
import { CollageListingComponent } from './employee/collage-listing/collage-listing.component';
import { CourseListingComponent } from './employee/course-listing/course-listing.component';

import { EmpDashboardComponent } from './employee/emp-dashboard/emp-dashboard.component';
import { EmployeListingComponent } from './employee/employe-listing/employe-listing.component';
import { ScheduleWebinarComponent } from './employee/schedule-webinar/schedule-webinar.component';
import { StudentListingComponent } from './employee/student-listing/student-listing.component';
import { WebinarListingComponent } from './employee/webinar-listing/webinar-listing.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CommonListingTblComponent } from './common/common-listing-tbl/common-listing-tbl.component';
import { EarnedBadgsCertificateComponent } from './student/earned-badgs-certificate/earned-badgs-certificate.component';
import { StudentCourseComponent } from './student/student-course/student-course.component';
import { StudentDashboardComponent } from './student/student-dashboard/student-dashboard.component';
import { TutorAddCourseComponent } from './tutor/tutor-add-course/tutor-add-course.component';
import { TutorAnalysisComponent } from './tutor/tutor-analysis/tutor-analysis.component';
import { TutorCoursListingComponent } from './tutor/tutor-cours-listing/tutor-cours-listing.component';
import { TutorDashboardComponent } from './tutor/tutor-dashboard/tutor-dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ExamPaperComponent } from './student/exam-paper/exam-paper.component';
import { CourseDetailsComponent } from './employee/course-details/course-details.component';
import { FeedbackComponent } from './common/feedback/feedback.component';
import { CourseByCategoriesComponent } from './employee/course-by-categories/course-by-categories.component';
import { CategoryComponent } from './employee/category/category.component';
import { AddCategoryComponent } from './employee/category/add-category/add-category.component';
import { StudentCourseDetailsComponent } from './student/student-course-details/student-course-details.component';
import { UserPermissionListingComponent } from './employee/user-permission-listing/user-permission-listing.component';
import { ModuleListingComponent } from './employee/module-listing/module-listing.component';
import { ExamPaperCheckComponent } from './collage/exam-paper-check/exam-paper-check.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'employee/dashboard', component: EmpDashboardComponent },
  { path: 'employee/setwebinar', component: ScheduleWebinarComponent },
  { path: 'employee/webinarList', component: WebinarListingComponent },
  { path: 'employee/profile', component: UserProfileComponent },
  { path: 'employee/editProfile', component: UserProfileComponent },
  { path: 'employee/addCourse', component: AddNewCouresComponent },
  { path: 'employee/addCollage', component: AddNewClgComponent },
  { path: 'employee/newStudent', component: AddNewStudentDetailComponent },
  { path: 'employee/editStudent/:id', component: AddNewStudentDetailComponent },
  { path: 'employee/editCourse/:id', component: AddNewCouresComponent },
  { path: 'employee/editCollage/:id', component: AddNewClgComponent },
  { path: 'employee/studentListing', component: StudentListingComponent },
  { path: 'employee/:id/course-listing', component: CourseListingComponent },
  {
    path: 'employee/courses/by-categories',
    component: CourseByCategoriesComponent,
  },
  { path: 'employee/collageListing', component: CollageListingComponent },
  { path: 'employee/conductExam', component: ConductExamComponent },
  { path: 'employee/addExamQuestions', component: ExamQuestionsComponent },
  { path: 'employee/viewExamQuestions/:id', component: ExamQuestionsComponent },
  { path: 'employee/editExamQuestions/:id', component: ExamQuestionsComponent },
  { path: 'employee/feedBackListing', component: CommonListingTblComponent },
  { path: 'employee/user', component: UserPermissionListingComponent },
  { path: 'employee/module', component: ModuleListingComponent },
  { path: 'employee/webinarAttendance', component: CommonListingTblComponent },

  { path: 'admin/categories', component: CategoryComponent },
  { path: 'admin/category/add', component: AddCategoryComponent },
  { path: 'admin/dashboard', component: EmpDashboardComponent },
  { path: 'admin/setwebinar', component: ScheduleWebinarComponent },
  { path: 'admin/webinarList', component: WebinarListingComponent },
  { path: 'admin/profile', component: UserProfileComponent },
  { path: 'admin/editProfile', component: UserProfileComponent },
  { path: 'admin/addCourse', component: AddNewCouresComponent },
  { path: 'admin/addCollage', component: AddNewClgComponent },
  { path: 'admin/newStudent', component: AddNewStudentDetailComponent },
  { path: 'admin/editStudent/:id', component: AddNewStudentDetailComponent },
  { path: 'admin/editCourse/:id', component: AddNewCouresComponent },
  { path: 'admin/editCollage/:id', component: AddNewClgComponent },
  { path: 'admin/studentListing', component: StudentListingComponent },
  { path: 'admin/:id/course-listing', component: CourseListingComponent },
  {
    path: 'admin/courses/by-categories',
    component: CourseByCategoriesComponent,
  },
  { path: 'admin/collageListing', component: CollageListingComponent },
  { path: 'admin/employeeListing', component: EmployeListingComponent },
  { path: 'admin/addEmployee', component: AddEditEmployeeComponent },
  { path: 'admin/editEmployee/:id', component: AddEditEmployeeComponent },
  { path: 'admin/conductExam', component: ConductExamComponent },
  { path: 'admin/addExamQuestions', component: ExamQuestionsComponent },
  { path: 'admin/viewExamQuestions/:id', component: ExamQuestionsComponent },
  { path: 'admin/editExamQuestions/:id', component: ExamQuestionsComponent },
  { path: 'admin/staffListing', component: StaffListingComponent },
  { path: 'admin/addNewStaff', component: AddStaffComponent },
  { path: 'admin/editStaff/:id', component: AddStaffComponent },
  { path: 'admin/feedBackListing', component: CommonListingTblComponent },
  { path: 'admin/user', component: UserPermissionListingComponent },
  { path: 'admin/module', component: ModuleListingComponent },
  { path: 'admin/webinarAttendance', component: CommonListingTblComponent },


  { path: 'college/login', component: LoginComponent },
  { path: 'college/profile', component: UserProfileComponent },
  { path: 'college/editProfile', component: UserProfileComponent },
  { path: 'college/dashboard', component: CollageDashboardComponent },
  { path: 'college/addCourse', component: AddNewCouresComponent },
  { path: 'college/newStudent', component: AddNewStudentDetailComponent },
  { path: 'college/studentListing', component: StudentListingComponent },
  { path: 'college/staffListing', component: StaffListingComponent },
  { path: 'college/addNewStaff', component: AddStaffComponent },
  { path: 'college/editStaff/:id', component: AddStaffComponent },
  { path: 'college/:id/course-listing', component: CourseListingComponent },
  {
    path: 'college/courses/by-categories',
    component: CourseByCategoriesComponent,
  },
  { path: 'college/conductExam', component: ConductExamComponent },
  { path: 'college/addExamQuestions', component: ExamQuestionsComponent },
  { path: 'college/viewExamQuestions/:id', component: ExamQuestionsComponent },
  { path: 'college/editExamQuestions/:id', component: ExamQuestionsComponent },
  { path: 'college/setwebinar', component: ScheduleWebinarComponent },
  { path: 'college/webinarList', component: WebinarListingComponent },
  { path: 'college/examResult', component: CommonListingTblComponent },
  { path: 'college/feedback', component: FeedbackComponent },
  { path: 'college/examCheck', component: CommonListingTblComponent },
  { path: 'college/examMarking/:id', component: ExamPaperCheckComponent },

  { path: 'staff/dashboard', component: TutorDashboardComponent },
  { path: 'staff/profile', component: UserProfileComponent },
  { path: 'staff/editProfile', component: UserProfileComponent },
  { path: 'staff/analysia', component: TutorAnalysisComponent },
  { path: 'staff/:id/course-listing', component: TutorCoursListingComponent },
  {
    path: 'staff/courses/by-categories',
    component: CourseByCategoriesComponent,
  },
  { path: 'staff/addCourse', component: TutorAddCourseComponent },
  { path: 'staff/editCourse/:id', component: TutorAddCourseComponent },
  { path: 'staff/feedback', component: FeedbackComponent },

  { path: 'student/dashboard', component: StudentDashboardComponent },
  { path: 'student/profile', component: UserProfileComponent },
  { path: 'student/editProfile', component: UserProfileComponent },
  { path: 'student/course', component: StudentCourseComponent },
  { path: 'student/otherCourse', component: StudentCourseComponent },
  { path: 'student/upCommingTest', component: CommonListingTblComponent },
  { path: 'student/upCommingWebinar', component: CommonListingTblComponent },
  { path: 'student/perviousExamResult', component: CommonListingTblComponent },
  { path: 'student/documentFile', component: CommonListingTblComponent },
  {
    path: 'student/certificateEarned',
    component: EarnedBadgsCertificateComponent,
  },
  { path: 'student/earnedBadges', component: EarnedBadgsCertificateComponent },
  { path: 'student/exam-paper/:id', component: ExamPaperComponent },
  { path: 'course/:id', component: CourseDetailsComponent },
  { path: 'student/courseDetail/:id', component: CourseDetailsComponent },
  { path: 'student/feedback', component: FeedbackComponent },
  { path: 'student/contactus', component: FeedbackComponent },
  {
    path: 'student/courses/by-categories',
    component: CourseByCategoriesComponent,
  },
  {
    path: 'student/:id/course-listing',
    component: StudentCourseDetailsComponent,
  },
  // {
  //   path: 'login',
  //   loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  // },
  // {
  //   path: 'employee',
  //   canActivate:[true],
  //   loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule)
  // },
  {
    path: '**',
    pathMatch: 'full',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
