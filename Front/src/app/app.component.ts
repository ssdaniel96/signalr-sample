import { CommonModule } from '@angular/common';
import { RealtimeService } from './realtime.service';
import { Component, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Message } from './message';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Front';

  public content: string = '';
  public messagesSent: Message[] = new Array<Message>();
  public messagesReceived: Message[] = new Array<Message>();
  public token: string;

  constructor(private realtimeService: RealtimeService){
    this.token = this.randomString(40, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    this.realtimeService.chatUpdated$.subscribe((message: Message) => {
      this.messagesReceived.push(message);
    });
  }

  private randomString(length: number, chars: string) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  public sendMessage(){
    console.log('Sending message: ', this.content);
    let newMessage = new Message(this.token, this.content);
    this.messagesSent.push(newMessage);
    this.realtimeService.sendMessage(newMessage);
    this.content = ''
  }
}
