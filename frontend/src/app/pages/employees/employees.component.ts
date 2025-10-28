import { Component, OnInit } from '@angular/core';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  baseUrl = environment.apiUrl;
  departmentData: any[] = [];
  employeesData: any[] = [];
  user: any;
  fileName: string = "EmployeeDetails.xlsx";


  constructor(public dialog: MatDialog, private http: HttpClient, private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    this.user = userData ? JSON.parse(userData) : null;
    this.getDepartments();

  }

  getDepartments() {
    this.http.get(`${this.baseUrl}/Master`).subscribe((res: any) => {
      if (res) {
        this.departmentData = res;
        this.getEmployees();
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
  openDialog(data: any): void {
    if (data.id) {
      this.router.navigateByUrl(`/add-employee?id=${data.id}`);
    }
    else {

      this.router.navigateByUrl('/add-employee');
    }


  }
  deleteEmployee(Id: any) {
    this.http.delete(`${this.baseUrl}/Master/delete-employee?Id=${Id}`).subscribe({
      next: (res: any) => {
        if (res.message) {
          this.toastr.error(res?.message);
          this.getEmployees()
        } else {
          this.toastr.error("Invalid Request")
        }
      },
      error: (err: any) => {
        this.toastr.error(err.error.message || 'Invalid Request')
      }
    })
  }

  exportExcel() {

    const table = document.getElementById("employee-list") as HTMLTableElement;

    const clonedTable = table.cloneNode(true) as HTMLTableElement;

    clonedTable.querySelectorAll("tr").forEach((row) => {
      row.deleteCell(-1);
    });

    if (this.user.role == 'admin') {

      var ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(clonedTable);
    } else {
      var ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);

    }

    // generate workbook and add the worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // save to file
    XLSX.writeFile(wb, this.fileName);



  }
}
