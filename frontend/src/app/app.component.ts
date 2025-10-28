import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from './services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Employee-Management-System';
  // faWarehouse=faWarehouse
isNavbarCollapsed = true;

constructor(public router : Router, private accService:AccountService){}
closeNavbar() {
  if (window.innerWidth < 768) {
      this.isNavbarCollapsed = true;
    }
}
onLogout(){
  this.accService.onLogout();
  this.closeNavbar();
}

}
