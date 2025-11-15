import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class GetChatService {

  baseUrl = environment.apiUrl;
  public chatMessagesSubject$=new BehaviorSubject<any[]>([]);
  constructor(private http: HttpClient) { }


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
