import { Component, OnInit } from '@angular/core';
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
export class ChatComponent implements OnInit {
  public content: string = '';
  public author: string = '';
  public messages: Message[] = new Array<Message>();
  public readyToMessage: boolean = false;
  public groups: Record<string, boolean> = {};

  constructor(private realtimeService: RealtimeService){
    this.realtimeService.chatUpdated$.subscribe((message: Message) => {
      this.messages.push(message);
    });
  }

  ngOnInit(): void {
    this.groups['group1'] = false;
    this.groups['group2'] = false;
    this.groups['group3'] = false;
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

  public toggleGroup(groupName: string){
    console.log('Toggling group: ', groupName);
    console.log('Group status: ', this.groups[groupName]);
    this.groups[groupName] = !this.groups[groupName];
    if (this.groups[groupName]){
      this.realtimeService.joinGroup(groupName, this.author);
    } else {
      this.realtimeService.leaveGroup(groupName, this.author);
    }
    console.log('Group toggled')
    console.log('Group status: ', this.groups[groupName]);
    console.log('')

  }
}
