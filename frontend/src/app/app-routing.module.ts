import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesComponent } from './pages/employees/employees.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LeavesComponent } from './pages/leaves/leaves.component';
import { DepartmentComponent } from './pages/department/department.component';
import { DepartmentListComponent } from './pages/department-list/department-list.component';
import { LoginComponent } from './pages/login/login.component';
import { AddEmployeeComponent } from './pages/add-employee/add-employee.component';
import { AuthGuard } from './services/auth.guard';
import { AttendanceComponent } from './pages/attendance/attendance.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  { path: 'dashboard', canActivate:[AuthGuard], component: DashboardComponent },
  // {path:"**",redirectTo:'home'},
  { path: 'employees', canActivate:[AuthGuard], component: EmployeesComponent },
  {path:'add-employee', canActivate:[AuthGuard], component:AddEmployeeComponent},
  { path: 'leaves', canActivate:[AuthGuard], component: LeavesComponent },
   { path: 'attendance', canActivate:[AuthGuard], component: AttendanceComponent },
  { path: 'departments',canActivate:[AuthGuard],  component: DepartmentListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
