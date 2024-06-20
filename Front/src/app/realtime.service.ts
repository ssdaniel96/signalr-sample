import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { Message } from './message';

@Injectable({
  providedIn: 'root',
})
export class RealtimeService {
  private connection: signalR.HubConnection;
  private chatUpdatedSubject: Subject<Message> = new Subject<Message>();
  public chatUpdated$: Observable<Message> =
    this.chatUpdatedSubject.asObservable();

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Debug)
      .withUrl('http://localhost:5030/hub', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      // .withKeepAliveInterval(1000 * 60 * 3)
      .withStatefulReconnect()
      .build();

    this.connection
      .start()
      .then(() => {
        console.log('Logged to SignalR Hub');
      })
      .catch((err) => {
        console.error('Error connecting to SignalR hub: ', err);
      });

    this.connection.on('messageReceived', (chat: Message) => {
      console.log('Message received: ', chat);
      this.chatUpdatedSubject.next(chat);
    });
  }

  public sendMessage(message: Message) {
    this.connection
      .invoke('newMessage', message)
      .then(() => console.log('Message sent'))
      .catch((err) => console.error('Error sending message: ', err));
  }
}
