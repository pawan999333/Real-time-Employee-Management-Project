import { Component, OnInit } from '@angular/core';
import { DepartmentComponent } from '../department/department.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.css']
})
export class DepartmentListComponent implements OnInit {
  baseUrl = environment.apiUrl;
  departmentData: any[]=[];
  user:any;

  constructor(public dialog: MatDialog, private http : HttpClient, private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    this.user = userData ? JSON.parse(userData) : null;
    this.getDepartments();
    console.log(this.user?.role)
  }

  getDepartments(){
     this.http.get(`${this.baseUrl}/Master`).subscribe((res:any)=>{
      if(res){
        this.departmentData=res;
      }
    })
  }
  openDialog(data:any): void {
    console.log(data);
    const dialogRef = this.dialog.open(DepartmentComponent, {
      width: '300px',
      data:data
     
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      console.log('The dialog was closed');
      if(result){

        this.getDepartments()
      }
    });
  }
  deleteDepartment(Id:any){
    this.http.delete(`${this.baseUrl}/Master?Id=${Id}`).subscribe({
      next:(res:any) => {
        if(res.message){
          this.toastr.error(res?.message);
          this.getDepartments()
        }else{
          this.toastr.error("Invalid Request")
        }
      },
      error:(err:any)=>{
        this.toastr.error(err.error.message || 'Invalid Request')
      }
    })
  }
}
