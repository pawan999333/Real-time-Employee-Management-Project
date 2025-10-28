import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../../environments/environment.prod'
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-add-leave',
  templateUrl: './add-leave.component.html',
  styleUrls: ['./add-leave.component.css']
})
export class AddLeaveComponent implements OnInit {
  baseUrl = environment.apiUrl;
  leaveForm = new FormGroup({
    empId: new FormControl('', [Validators.required]),
    empName: new FormControl('', [Validators.required]),
    leaveType: new FormControl('', [Validators.required]),
    reason: new FormControl(''),
    startDate: new FormControl(null, [Validators.required]),
    endDate: new FormControl(null)
  })

  constructor(private dialogRef: MatDialogRef<AddLeaveComponent>, private http: HttpClient,
    private toastr: ToastrService, @Inject(MAT_DIALOG_DATA) public data: any

  ) { }

  ngOnInit(): void {
    if (this.data && this.data.id) {
      this.leaveForm.patchValue({ empId: this.data.id });
      this.leaveForm.patchValue({ empName: this.data.empName })

    }

  }



  addLeave() {
    console.warn(this.leaveForm.value);

    this.http.post(`${this.baseUrl}/Leave/add-leaves`, this.leaveForm.value)
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

