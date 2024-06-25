import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { Message } from './message';

@Injectable({
  providedIn: 'root',
})
export class RealtimeService {
  private token: string = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImYwOGU2ZTNmNzg4ZDYwMTk0MDA1ZGJiYzE5NDc0YmY5Mjg5ZDM5ZWEiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiSUFUZWMgLSBEYW5pZWwgZGEgU2lsdmEgU29hcmVzIiwiY3VzdG9tIjp0cnVlLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYXJtcy1kZXYtZDE3YTMiLCJhdWQiOiJhcm1zLWRldi1kMTdhMyIsImF1dGhfdGltZSI6MTcxOTM0NzA4MSwidXNlcl9pZCI6InA5ekczUjNpMFNkVUZqZ20zY1hXRVVYR2lCNTIiLCJzdWIiOiJwOXpHM1IzaTBTZFVGamdtM2NYV0VVWEdpQjUyIiwiaWF0IjoxNzE5MzQ3MDgxLCJleHAiOjE3MTkzNTA2ODEsImVtYWlsIjoiZGFuaWVsLnNvYXJlc0BpYXRlYy5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsibWljcm9zb2Z0LmNvbSI6WyIyZTQ5ZWM4Yy1jMzQ0LTQ5MGEtOTFjZi0xYTRhYzA4YTYwYzYiXSwiZW1haWwiOlsiZGFuaWVsLnNvYXJlc0BpYXRlYy5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJjdXN0b20ifX0.YbeoSViidj2J7JWPnQXUbLAAj4-Vd8FxgNi2Mj6GwQ6iOAyQ9JHhLu__-S0f3g813dnzrTxx_cwwFr3OMtf7zTLQzqcyB8vw3ZyQS4umvbikiom6Suhl6afjDbsIxyOHrFKCAuwBYGQBewq_pDLTLet-lZ9KNItnUSeILca0HMSm8kX_UMwrvZB_jexvEbSlF0ua3XSvJc6VU1vj_tXie7tCnQmLoIe70T-x-L30HUCIf7iVfNBfFXaDd3HK9PTzc3kKyQnhKcwu1YHlwWodkam4CTlu4reJYF117zQ0K_dkjolvZSd8XKCZFb6O2tXaxfguADcX1J8qd20VJQxI6g';
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
        accessTokenFactory: async () => this.token,
      })
      .withAutomaticReconnect()
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
