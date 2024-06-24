import { Component } from '@angular/core';
import { Message } from '../message';
import { RealtimeService } from '../realtime.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
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
