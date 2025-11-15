import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DownloadService } from 'src/app/services/download.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-salery',
  templateUrl: './salery.component.html',
  styleUrls: ['./salery.component.css']
})
export class SaleryComponent implements OnInit {
  userDetails: any = localStorage.getItem('user');
  user: any;
  saleryFrm!: FormGroup;
  years: number[] = [];
  baseUrl = environment.apiUrl;
  downloadFlag: boolean=false;
  constructor(private downloadService: DownloadService, private http: HttpClient, private toastr: ToastrService,
    private router: Router, private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.saleryFrm = new FormGroup({
      empId: new FormControl(''),
      empName: new FormControl(''),
      month: new FormControl(null, [Validators.required]),
      year: new FormControl(null, [Validators.required]),
      workingDays: new FormControl(27, [Validators.required]),
      attendanceDays: new FormControl(0),
      workingSalery: new FormControl(0),
      provideSalery: new FormControl(0)
    });

    const empId = this.activateRoute.snapshot.queryParamMap.get('empId');
    this.employeeDetails(empId);
    for (let y = 1990; y <= 2026; y++) {
      this.years.push(y);
    }
    console.log(this.user)
    // this.user = this.userDetails ? JSON.parse(this.userDetails) : null;


  }
  generateSalery(emp: any) {
    this.downloadService.downloadSalry(emp).subscribe((res: any) => {
      let blob: Blob = res.body as Blob;
      let url = window.URL.createObjectURL(blob);
      window.open(url)
    });
  }
  downloadSalerySlip(emp: any) {
    this.downloadService.downloadSalry(emp).subscribe((res: any) => {
      let blob: Blob = res.body as Blob;
      let url = window.URL.createObjectURL(blob);

      let a = document.createElement('a');
      a.download = `SalarySlip_${emp?.empName}_${emp?.month}/${emp?.year}`;
      a.href = url;
      a.click();
    });
  }
  employeeDetails(empId: any) {
    this.http.get(`${this.baseUrl}/Master/Get-Employees?Id=${empId}`).subscribe({
      next: (res: any) => {
        if (res) {
          
          this.user = res[0];
          console.log("user", this.user)
          if (this.user && this.user?.id) {
            this.saleryFrm.patchValue({
              empId: this.user?.id,
              empName: this.user?.empName,
              workingSalery: this.user?.salery
            });
          }
        } else {
          this.toastr.error("Invalid data");
        }
      },
      error: (err: any) => {
        const errorMessage = err?.error?.message || "Something went wrong!";
      }
    })
  }
  getSalery() {
    const payload = {
      empId: this.saleryFrm.get('empId')?.value,
      month: this.saleryFrm.get('month')?.value,
      year: this.saleryFrm.get('year')?.value
    }
    this.http.post(`${this.baseUrl}/Salery`, payload).subscribe({
      next: (res: any) => {
        if (res>=0) {
          this.downloadFlag=!this.downloadFlag;
          this.saleryFrm.patchValue({ attendanceDays: res });
          const workingAmount = this.saleryFrm.get('workingSalery')?.value;
          const workingAmountDays = this.saleryFrm.get('workingDays')?.value;
          const finalSalary = ((workingAmount / workingAmountDays) * res);
          this.saleryFrm.patchValue({ provideSalery: finalSalary })

        }
      }
    })
  }

}
