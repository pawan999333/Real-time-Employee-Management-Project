import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  baseUrl = environment.apiUrl;
  public employeeData$ = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) { }

  getEmployees() {

    this.http.get(`${this.baseUrl}/Master/Get-Employees`).subscribe((res: any) => {
      if (res) {
        this.employeeData$.next(res);
        
      }
    }, (err) => {
      console.error('Error fetching employees', err);
    }
    )
  }
}
