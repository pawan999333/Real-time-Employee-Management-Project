import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LeavesComponent } from './pages/leaves/leaves.component';
import { DepartmentComponent } from './pages/department/department.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { DepartmentListComponent } from './pages/department-list/department-list.component';
import { MatDialogModule } from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { ToastrModule } from 'ngx-toastr';
import { AddEmployeeComponent } from './pages/add-employee/add-employee.component';
import { NgChartsModule } from 'ng2-charts';
import { LoginComponent } from './pages/login/login.component';
import { CustomInterceptor } from './services/custom.interceptor';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { AddLeaveComponent } from './pages/add-leave/add-leave.component';

@NgModule({
  declarations: [
    AppComponent,
    EmployeesComponent,
    DashboardComponent,
    LeavesComponent,
    DepartmentComponent,
    DepartmentListComponent,
    AddEmployeeComponent,
    LoginComponent,
    AttendanceComponent,
    AddLeaveComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
     MatButtonModule,
    MatInputModule,
    MatCardModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    MatRadioModule ,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgChartsModule,
    MatTooltipModule 
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass:CustomInterceptor,multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
