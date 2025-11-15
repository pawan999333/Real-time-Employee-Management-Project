import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from '../services/auth.guard';
import { EmployeesComponent } from './employees/employees.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { LeavesComponent } from './leaves/leaves.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { DepartmentListComponent } from './department-list/department-list.component';
import { SaleryComponent } from './salery/salery.component';
import { ChatComponent } from './chat/chat.component';
import { AddChatComponent } from './add-chat/add-chat.component';

const routes: Routes = [


  { path: 'dashboard', canActivate: [AuthGuard], component: DashboardComponent },
  // {path:"**",redirectTo:'home'},
  { path: 'employees', canActivate: [AuthGuard], component: EmployeesComponent },
  { path: 'add-employee', canActivate: [AuthGuard], component: AddEmployeeComponent },
  { path: 'leaves', canActivate: [AuthGuard], component: LeavesComponent },
  { path: 'attendance', canActivate: [AuthGuard], component: AttendanceComponent },
  { path: 'departments', canActivate: [AuthGuard], component: DepartmentListComponent },
  { path: 'salery', canActivate: [AuthGuard], component: SaleryComponent },
  { path: 'chat', canActivate: [AuthGuard], component: ChatComponent },
  { path: 'add-chat', canActivate: [AuthGuard], component: AddChatComponent },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
