import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from './services/account.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // title = 'Employee-Management-System';
  // faWarehouse=faWarehouse
  isNavbarCollapsed = true;

  constructor(public router: Router, private accService: AccountService, private meta: Meta, private title: Title) {
    this.title.setTitle('EmploySync Connect');

    this.meta.addTags([
      {
        name: 'description',
        content: 'EmploySync Connect - An Angular-based Employee Management System. Manage employees, attendance, leave approvals, salary slips, and real-time chat in one portal.'
      },
      {
        name: 'keywords',
        content: 'EmploySync Connect, Employee Management, Attendance Management, Leave Management, Salary Slip PDF, Admin Portal, Real-time Chat, Angular, SignalR'
      },
      { name: 'author', content: 'Pawan Kumar Sharma' },
      { name: 'robots', content: 'index, follow' },
    ]);
  }
  closeNavbar() {
    if (window.innerWidth < 768) {
      this.isNavbarCollapsed = true;
    }
  }
  onLogout() {
    this.accService.onLogout();
    this.closeNavbar();
  }

}
