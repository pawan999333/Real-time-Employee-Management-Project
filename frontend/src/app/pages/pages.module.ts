import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeesComponent } from './employees/employees.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LeavesComponent } from './leaves/leaves.component';
import { DepartmentListComponent } from './department-list/department-list.component';
import { DepartmentComponent } from './department/department.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { AddLeaveComponent } from './add-leave/add-leave.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { NgChartsModule } from 'ng2-charts';
import { CustomInterceptor } from '../services/custom.interceptor';
import { SaleryComponent } from './salery/salery.component';
import { ChatComponent } from './chat/chat.component';
import { AddChatComponent } from './add-chat/add-chat.component';


console.log("pages module load")

@NgModule({
  declarations: [
    EmployeesComponent,
    DashboardComponent,
    LeavesComponent,
    DepartmentComponent,
    DepartmentListComponent,
    AddEmployeeComponent,
    AttendanceComponent,
    AddLeaveComponent,
    SaleryComponent,
    ChatComponent,
    AddChatComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    HttpClientModule,
    MatRadioModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgChartsModule,
    MatTooltipModule
    
  ],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: CustomInterceptor, multi: true }],
  
})
export class PagesModule { }
