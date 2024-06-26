import { Component, OnDestroy, OnInit } from '@angular/core';
import { Message } from '../models/message';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Chat3Service } from '../../services/chat3.service';

@Component({
  selector: 'app-chat3',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './chat3.component.html',
  styleUrl: './chat3.component.css'
})
export class Chat3Component implements OnInit, OnDestroy {
  public content: string = '';
  public author: string = '';
  public messages: Message[] = new Array<Message>();
  public readyToMessage: boolean = false;
  public groups: Record<string, boolean> = {};

  constructor(private chat3Service: Chat3Service){
    this.chat3Service.chatUpdated$.subscribe((message: Message) => {
      this.messages.push(message);
    });
  }

  async ngOnDestroy(): Promise<void> {
    await this.chat3Service.stopConnection().then(() => {
      console.log('Chat1Component: stop the conneciton');
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
    this.chat3Service.sendMessage(newMessage);
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
      this.chat3Service.joinGroup(groupName, this.author);
    } else {
      this.chat3Service.leaveGroup(groupName, this.author);
    }
    console.log('Group toggled')
    console.log('Group status: ', this.groups[groupName]);
    console.log('')

  }
}
