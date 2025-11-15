import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { blob } from 'stream/consumers';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) { }


  downloadSalry(emp:any){
    // debugger
    return this.http.post(`${this.baseUrl}/Pdf/generate-pdf`, emp, {observe:'response', responseType:'blob'})
  }
}
