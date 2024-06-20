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
  public author: string = '';
  public messages: Message[] = new Array<Message>();
  public readyToMessage: boolean = false;

  constructor(private realtimeService: RealtimeService){
    this.realtimeService.chatUpdated$.subscribe((message: Message) => {
      this.messages.push(message);
    });
  }

  public sendMessage(){
    console.log('Sending message: ', this.content);
    let newMessage = new Message(this.author, this.content);
    this.messages.push(newMessage);
    this.realtimeService.sendMessage(newMessage);
    this.content = ''
  }

  public setName(){
    this.readyToMessage = true;
  }
}
