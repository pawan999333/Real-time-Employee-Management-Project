import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private hubConnection!: signalR.HubConnection;
  public messages: { empName: string; message: string }[] = [];
  private isConnected = false;
  userdata = JSON.parse(localStorage.getItem('user')!);
  baseUrl = environment.apiUrl;
  public chatMessagesSubject$=new BehaviorSubject<any[]>([]);

  constructor(private http:HttpClient){}

  startConnection() {
    const empId = this.userdata.id.toString();
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.baseUrl}/chatHub?empId=${this.userdata.empName}`)
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('✅ SignalR connected!');
        this.isConnected = true;
      })
      .catch(err => console.error('❌ Error while starting connection:', err));

    const empName = this.userdata.empName;
    this.hubConnection.on('ReceiveMessage', (empName, message) => {
      // this.messages.next(this.chatMessagesSubject$);
      // debugger
      const newMsg={ sender:empName, message }
        const oldMsgs = this.chatMessagesSubject$.getValue() || [];

  const updatedMsgs = [...oldMsgs, newMsg];

  this.chatMessagesSubject$.next(updatedMsgs);
    });
  }

  // sendMessage(user: string, message: string) {
  //   if (!this.isConnected) {
  //     console.warn('⚠️ Not connected yet. Please wait a second.');
  //     return;
  //   }

  //   this.hubConnection.invoke('SendMessage', user, message)
  //     .catch(err => console.error('Send error:', err));
  // }
  public sendMessage(receiverEmpId: any, senderEmpId: any, message: string): void {
    this.hubConnection.invoke('SendMessageToUser', receiverEmpId, senderEmpId, message)
      .catch(err => console.error('❌ Error while sending message:', err));
  }
   getChats(sender:any,receiver:any){
    const payload={
      sender:sender,
      receiver:receiver
    }
    this.http.post(`${this.baseUrl}/chat`,payload).subscribe({
      next:(res:any)=>{
        if(res && res.message){
          this.chatMessagesSubject$.next(res.message);
        }
      },
      error:(err:any)=>{
        console.log(err.error)
      }
    })
  }
}
