import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { Message } from './message';

@Injectable({
  providedIn: 'root',
})
export class RealtimeService {
  private token: string = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImRmOGIxNTFiY2Q5MGQ1YjMwMjBlNTNhMzYyZTRiMzA3NTYzMzdhNjEiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiSUFUZWMgLSBEYW5pZWwgZGEgU2lsdmEgU29hcmVzIiwiY3VzdG9tIjp0cnVlLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYXJtcy1kZXYtZDE3YTMiLCJhdWQiOiJhcm1zLWRldi1kMTdhMyIsImF1dGhfdGltZSI6MTcxODk3NzQzOCwidXNlcl9pZCI6InA5ekczUjNpMFNkVUZqZ20zY1hXRVVYR2lCNTIiLCJzdWIiOiJwOXpHM1IzaTBTZFVGamdtM2NYV0VVWEdpQjUyIiwiaWF0IjoxNzE4OTc3NDM4LCJleHAiOjE3MTg5ODEwMzgsImVtYWlsIjoiZGFuaWVsLnNvYXJlc0BpYXRlYy5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsibWljcm9zb2Z0LmNvbSI6WyIyZTQ5ZWM4Yy1jMzQ0LTQ5MGEtOTFjZi0xYTRhYzA4YTYwYzYiXSwiZW1haWwiOlsiZGFuaWVsLnNvYXJlc0BpYXRlYy5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJjdXN0b20ifX0.CCfUHienbhSaed-RxhHC8wtg94zQK3bS6byixtcLwfY3d0rViN0v61JlEibsl9frveX0cHNOrKQjyY8UnY3xG_lO-DSFHV6TMfqHzC2WtfkfdB-iYIAsKDTusI2PvM0CyXKgTkCpYxE9IkNDQCdkSx79tUfMIwXrNIE2RltjV9DLMeGagZcDBi9OHBO-68DRVCVZDI4jCyaNAFuFd9jyUBj12XJhDfdlWrZM8PFAMfCUpsRT2hkSHYcTWIxp00mlM0XmM8_SK12vlrT9e9zBv7rq9mmD_-4XtB1rOOz-mlhonR_k_IqJhvpzm85TyI2QnmUqZu4vgJ6HK8QP3_GAVg'
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
        accessTokenFactory: () => 'Bearer ' + this.token,
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
