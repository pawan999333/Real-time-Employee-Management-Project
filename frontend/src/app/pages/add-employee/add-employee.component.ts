import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment.prod'
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {

  data: any;
  baseUrl = environment.apiUrl;
  empForm = new FormGroup({
    id: new FormControl(null),
    empName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    phone: new FormControl(''),
    lastWorkingDate: new FormControl(''),
    joiningDate: new FormControl('', [Validators.required]),
    salery: new FormControl(''),
    dateOfBirth: new FormControl('', [Validators.required]),
    gender: new FormControl('Male', [Validators.required]),
    jobTitle: new FormControl('', [Validators.required]),
    departmentId: new FormControl('', [Validators.required]),



  })
  departmentData: any[] = [];

  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private activateRoute: ActivatedRoute,
    private router: Router

  ) { }

  ngOnInit(): void {
    const id = this.activateRoute.snapshot.queryParamMap.get('id');
    if (id) {
      this.getEmployees(id);
    }
    this.getDepartments()

  }

  get getDepartmentName() {
    return this.empForm.get('empName');
  }
  getDepartments() {
    this.http.get(`${this.baseUrl}/Master`).subscribe((res: any) => {
      if (res) {
        this.departmentData = res;
      }
    })
  }
  addEmployee() {
    console.warn(this.empForm.value);
    if (this.data && this.data.empName) {
      this.http.put(`${this.baseUrl}/Auth/UpdateEmployee`, this.empForm.value)
        .subscribe({
          next: (res: any) => {
            if (res?.message) {
              console.log(res.message);
              this.toastr.success(res.message);
              this.router.navigateByUrl('/employees')
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
    } else {
      this.http.post(`${this.baseUrl}/Auth/Add-Employee`, this.empForm.value)
        .subscribe({
          next: (res: any) => {
            if (res?.message) {
              console.log(res.message);
              
              
              this.http.get(`${this.baseUrl}/Auth/send-email?requestEmail=${this.empForm.get('email')?.value}`)
                .subscribe({
                  next: (res: any) => {
                    if (res?.message) {  
                      this.toastr.success(res.message);                   
                      this.router.navigateByUrl('/employees')

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
  getEmployees(id: any) {
    this.http.get(`${this.baseUrl}/Master/Get-Employees?id=${id}`).subscribe((res: any) => {
      if (res) {
        this.data = res[0];
        if (this.data && this.data.empName) {
          this.empForm.patchValue({
            id: this.data.id,
            empName: this.data.empName,
            email: this.data.email,
            joiningDate: this.data.joiningDate,
            lastWorkingDate: this.data.lastWorkingDate,
            dateOfBirth: this.data.dateOfBirth,
            salery: this.data.salery,
            gender: this.data.gender,
            phone: this.data.phone,
            jobTitle: this.data.jobTitle,
            departmentId: this.data.departmentId

          })
        }
      }
    })
  }
}
