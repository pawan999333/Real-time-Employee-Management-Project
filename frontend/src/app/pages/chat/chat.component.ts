import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { EmployeesService } from 'src/app/services/employees.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GetChatService } from 'src/app/services/get-chat.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
})
export class ChatComponent implements OnInit {
  user = '';
  message = '';
  chatView: boolean = false;
  userdata = JSON.parse(localStorage.getItem('user')!);
  employeesData: any[] = [];
  baseUrl = environment.apiUrl;
  empId:any;
  employessList:any[]=[]
  constructor(public chatService: ChatService, private http: HttpClient, public employeeService:EmployeesService,
    private router:Router, private activateRoute:ActivatedRoute, public getChatService:GetChatService
  ) { }

  ngOnInit() {
    this.chatService.startConnection();
    this.employeeService.getEmployees();
   this.employeeService.employeeData$
    .pipe(
      map((data: any[]) => data.filter(emp => emp.id !== this.userdata.id))
    )
    .subscribe(result => {
      this.employessList = result;
      console.log("Filtered employees:", this.employessList);
    });

    
  }
  


  startChat(emp:any){
          this.router.navigateByUrl(`/pages/add-chat?empId=${emp.empName}`);
          this.chatService.getChats(this.userdata.empName,emp.empName);
  }
}
