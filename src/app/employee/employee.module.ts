import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EmpDashboardComponent } from './emp-dashboard/emp-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpService } from '../service/http.service';
import { ModuleListingComponent } from './module-listing/module-listing.component';
import { AddUpdateModuleComponent } from './module-listing/add-update-module/add-update-module.component';

const routes: Routes = [
  { path: 'dashboard', component: EmpDashboardComponent },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  providers: [HttpService],
  entryComponents: [],
  declarations: [
   
  ],
  // declarations: [ ScheduleWebinarComponent,WebinarListingComponent,AddNewCouresComponent, AddNewClgComponent,AddNewStudentDetailComponent,StudentListingComponent,CourseListingComponent, CollageListingComponent]
})
export class EmployeeModule {}
