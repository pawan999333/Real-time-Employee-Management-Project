import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { environment } from 'src/environments/environment.prod';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  baseUrl = environment.apiUrl;
siteKey:string="6LdhqWIsAAAAAFqrvUxv6Digkcds94M5D5I4UqPg"
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    passwordHash: new FormControl('', [Validators.required]),
    recaptcha: new FormControl('', [Validators.required])
  })
  constructor(private http: HttpClient, private toastr: ToastrService, private accService: AccountService,
    private router: Router, private seoService: SeoService
  ) { }

  ngOnInit(): void {
    // Apply SEO for login page
    this.seoService.applyPageSeo('login');
  }

  onLogin() {
    console.log(this.loginForm.value);
    this.accService.onLogin(this.loginForm.value).subscribe({

      next: (res: any) => {
        if (res.message) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.toastr.success(res.message)
          this.router.navigateByUrl('/pages/dashboard');
        } else {
          this.toastr.error("Invalid Request")
        }
      },
      error: (err: any) => {
        this.toastr.error(err.error.message || 'Invalid Request')
      }
    })

  }
  addUser(){

      this.router.navigateByUrl('/pages/add-employee');
    
  }
  resetForm(){
    this.loginForm.reset();
  }
}

