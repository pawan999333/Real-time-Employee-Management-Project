import { Component, OnInit } from '@angular/core';
import { DepartmentComponent } from '../department/department.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  baseUrl = environment.apiUrl;
  user: any;
  attendanceData: any[] = [];
  fileName: string = "AttendanceDetails.xlsx";

  constructor(public dialog: MatDialog, private http: HttpClient, private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    this.user = userData ? JSON.parse(userData) : null;
    this.getAttendanceData();
  }

  getAttendanceData() {
    let empId = null;
    let url = this.http.get(`${this.baseUrl}/Attendance/attendance-list`)
    if (this.user.role == 'emp') {
      empId = this.user.id;
      url = this.http.get(`${this.baseUrl}/Attendance/attendance-list?EmpId=${empId}`)
    }
    url.subscribe((res: any) => {
      if (res) {
        this.attendanceData = res?.message;
      }
    })
  }


  exportExcel() {

    const table = document.getElementById("attendace-list") as HTMLTableElement;




    var ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);



    // generate workbook and add the worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // save to file
    XLSX.writeFile(wb, this.fileName);



  }
}
