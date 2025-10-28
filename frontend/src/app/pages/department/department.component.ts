import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../../environments/environment.prod'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {

  baseUrl = environment.apiUrl;
  departmentForm = new FormGroup({
    id:new FormControl(null),
    departmentName:new FormControl('', [Validators.required])
  })

  constructor(  private dialogRef: MatDialogRef<DepartmentComponent>, private http : HttpClient,
    private toastr: ToastrService, @Inject(MAT_DIALOG_DATA) public data: any

  ) { }

  ngOnInit(): void {
    console.log(this.data)
    if(this.data && this.data.departmentName){
      this.departmentForm.patchValue({
        id:this.data.id,
        departmentName:this.data.departmentName
      })
    }
  }

  get getDepartmentName(){
    return this.departmentForm.get('departmentName');
  }
  
 addDepartment() {
  console.warn(this.departmentForm.value);
  if(this.data && this.data.departmentName){
    this.http.put(`${this.baseUrl}/Master`, this.departmentForm.value)
    .subscribe({
      next: (res: any) => { 
        if (res?.message) {
          console.log(res.message);
          this.toastr.success(res.message);
          this.dialogRef.close(true);
        } else {
          this.toastr.error("Invalid Data");
        }
      },
      error: (err: any) => {  
        console.error(err);
        const errorMessage = err?.error?.message || "Something went wrong!";
        this.toastr.error(errorMessage);  
      }
    });
  }else{
     this.http.post(`${this.baseUrl}/Master`, this.departmentForm.value)
    .subscribe({
      next: (res: any) => { 
        if (res?.message) {
          console.log(res.message);
          this.toastr.success(res.message);
          this.dialogRef.close(true);
        } else {
          this.toastr.error("Invalid Data");
        }
      },
      error: (err: any) => {  
        console.error(err);
        const errorMessage = err?.error?.message || "Something went wrong!";
        this.toastr.error(errorMessage);  
      }
    });
  }
 
}


}
