import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { EmployeesService } from 'src/app/services/employees.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GetChatService } from 'src/app/services/get-chat.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-add-chat',
  templateUrl: './add-chat.component.html',
  styleUrls: ['./add-chat.component.css']
})
export class AddChatComponent implements OnInit {
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
    this.empId=this.activateRoute.snapshot.queryParamMap.get('empId');
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

     this.chatService.getChats(this.userdata.empName,this.empId);
  }
  

  send() {


    
    const id = this.userdata.empName;
    if (this.userdata && this.message) {
      // debugger
      this.chatService.sendMessage(this.empId, id, this.message);
      this.message=''

      
    }
  }


}
