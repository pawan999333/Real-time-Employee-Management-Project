import { Component, OnInit } from '@angular/core';
import { DepartmentComponent } from '../department/department.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { ToastrService } from 'ngx-toastr';
import { AddLeaveComponent } from '../add-leave/add-leave.component';
import { subscribe } from 'diagnostics_channel';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.css']
})
export class LeavesComponent implements OnInit {
 baseUrl = environment.apiUrl;
  user: any;
  leavesData: any[] = [];
    fileName: string = "LeavesDetails.xlsx";


  constructor(public dialog: MatDialog, private http: HttpClient, private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    this.user = userData ? JSON.parse(userData) : null;
    this.getLeaves();
  }

  getLeaves() {
    let empId = null;
    let url = this.http.get(`${this.baseUrl}/Leave/leaves-list`)
    if (this.user.role == 'emp') {
      empId = this.user.id;
      url = this.http.get(`${this.baseUrl}/Leave/leaves-list?EmpId=${empId}`)
    }
    url.subscribe((res: any) => {
      if (res) {
        this.leavesData = res?.message;
      }
    })
  }
  openDialog(user:any){
    const dialogRef = this.dialog.open(AddLeaveComponent, {
      width: '390px',
      data:user
     
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      console.log('The dialog was closed');
      if(result){

        this.getLeaves()
      }
    });
  }

  updateLeave(item:any,result:any){
    const payload={
      id:item?.id,
      result:result
    }
    this.http.put(`${this.baseUrl}/Leave/update-leaves`,payload).subscribe({
      next:(res:any)=>{
        if(res.message){
          this.toastr.success(res.message);
           this.getLeaves()
        }
      },
      error:(err:any)=>{
         this.toastr.error(err.error.message)
      }
    })
  }
   exportExcel() {
  
      const table = document.getElementById("leaves-list") as HTMLTableElement;
  
      const clonedTable = table.cloneNode(true) as HTMLTableElement;
  
      clonedTable.querySelectorAll("tr").forEach((row) => {
        row.deleteCell(-1);
      });
  
      if (this.user.role == 'admin') {
  
        var ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
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



