import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { Message } from './message';

@Injectable({
  providedIn: 'root',
})
export class RealtimeService {
  private token: string = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImYwOGU2ZTNmNzg4ZDYwMTk0MDA1ZGJiYzE5NDc0YmY5Mjg5ZDM5ZWEiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiSUFUZWMgLSBEYW5pZWwgZGEgU2lsdmEgU29hcmVzIiwiY3VzdG9tIjp0cnVlLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYXJtcy1kZXYtZDE3YTMiLCJhdWQiOiJhcm1zLWRldi1kMTdhMyIsImF1dGhfdGltZSI6MTcxOTI1ODIwMCwidXNlcl9pZCI6InA5ekczUjNpMFNkVUZqZ20zY1hXRVVYR2lCNTIiLCJzdWIiOiJwOXpHM1IzaTBTZFVGamdtM2NYV0VVWEdpQjUyIiwiaWF0IjoxNzE5MjU4MjAwLCJleHAiOjE3MTkyNjE4MDAsImVtYWlsIjoiZGFuaWVsLnNvYXJlc0BpYXRlYy5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsibWljcm9zb2Z0LmNvbSI6WyIyZTQ5ZWM4Yy1jMzQ0LTQ5MGEtOTFjZi0xYTRhYzA4YTYwYzYiXSwiZW1haWwiOlsiZGFuaWVsLnNvYXJlc0BpYXRlYy5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJjdXN0b20ifX0.QDbJzTQWBEP-ZRVbKZd-21gHB-y9hO9dFAGP6QVh9BsUBnouDxwFvVDosdPaNS50GxtpYjeYgVOyOppSNZJAJJCE-uXgPKv_eXyVd9e49YYitbVFDsgXrNoi0pkylZw-nsM175p7ByKP4IeXLbt6tUBWFZC_mtqSVvHt_JuLbtj2xvEsBcSFzah651Bpi7KAwzcMy7PMHktYLXOGHG5CfggFFedyEtteZ2z3gniBgRzFOztSLwACCj9e6H8Lv-tHPwo-OFHlFVx4FwWQIeP5p0YiVz12OWIFBLh5pr4N9BbmpjSyWBviTaEKm75w9n9Zdh-xtpAOlGxvK_u8btH-Ig'
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

  public joinGroup(groupName: string) {
    this.connection
      .invoke('joinGroup', groupName)
      .then(() => console.log('Joined group: ', groupName))
      .catch((err) => console.error('Error joining group: ', err));
  }

  public leaveGroup(groupName: string) {
    this.connection
      .invoke('leaveGroup', groupName)
      .then(() => console.log('Left group: ', groupName))
      .catch((err) => console.error('Error leaving group: ', err));
  }
}
