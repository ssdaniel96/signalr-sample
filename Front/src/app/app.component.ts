import { CommonModule } from '@angular/common';
import { RealtimeService } from './realtime.service';
import { Component, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Front';

  public message: string = '';
  public messagesSent: string[] = [];
  public messagesReceived: string[] = [];

  constructor(private RealtimeService: RealtimeService){

  }

  public sendMessage(){
    console.log('Sending message: ', this.message);
    this.messagesSent.push(this.message);
    this.message = '';
  }
}
