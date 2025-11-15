import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartConfiguration } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentDate:Date=new Date();
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: { beginAtZero: true }
    }
  };

  barChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      { data: [], label: 'Department'}
    ]
  };

  baseUrl = environment.apiUrl;
  departmentData: any[] = [];
  employeesData: any[] = [];
  empCount: any[] = [];
  userDetails: any;
  leavesData: any[] = [];

  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.userDetails = JSON.parse(localStorage.getItem('user') || '{}');
    this.getEmployeeDepartmentwise();
    this.getDepartments();
    this.getEmployees();
    this.getLeaves()

  }
  getDepartments() {
    this.http.get(`${this.baseUrl}/Master`).subscribe((res: any) => {
      if (res) {
        this.departmentData = res;



      }
    })
  }
  getEmployees() {
    this.http.get(`${this.baseUrl}/Master/Get-Employees`).subscribe((res: any) => {
      if (res) {
        this.employeesData = res;
      }
    })
  }
  getEmployeeDepartmentwise() {
    this.http.get(`${this.baseUrl}/Master/employeeDepartmentwise`).subscribe((res: any) => {
      if (res) {
        this.empCount = res;
        const departmentNames = this.empCount.map((d: any) => d.departmentName);
        const empCountValues = this.empCount.map((d: any) => d.employeeCount);

        this.barChartData = {
          labels: departmentNames,
          datasets: [
            {
              data: empCountValues,
              label: 'Departments',
            }
          ]
        }
      }
    })
  }

  view(text: any) {
    if (text == 'emp') {
      this.router.navigate(['pages/employees'])
    }
    if (text == 'dept') {
      this.router.navigate(['pages/departments'])
    }
  }
  markAttendace(){
    const payload={
      empId:this.userDetails.id,
      empName:this.userDetails.empName,
      isAttend:true
    }
    this.http.post(`${this.baseUrl}/Attendance/add-attendance`,payload).subscribe({
      next:(res:any)=> {
        if(res.message){
          this.toastr.success(res.message)
        }
      },
      error:(err:any)=>{
        this.toastr.error(err.error.message);
      }
    })
  }
  leavesList(){
    this.router.navigateByUrl('pages/leaves');
  }
    getLeaves() {
    let empId = null;
    let url = this.http.get(`${this.baseUrl}/Leave/leaves-list`)
    if (this.userDetails.role == 'emp') {
      empId = this.userDetails.id;
      url = this.http.get(`${this.baseUrl}/Leave/leaves-list?EmpId=${empId}`)
    }
    url.subscribe((res: any) => {
      if (res) {
        this.leavesData = res?.message;
      }
    })
  }
}
