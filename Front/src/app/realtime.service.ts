import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, Subject, delay } from 'rxjs';
import { Message } from './message';

@Injectable({
  providedIn: 'root',
})
export class RealtimeService {
  private token: string =
    'eyJhbGciOiJSUzI1NiIsImtpZCI6ImYwOGU2ZTNmNzg4ZDYwMTk0MDA1ZGJiYzE5NDc0YmY5Mjg5ZDM5ZWEiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiSUFUZWMgLSBEYW5pZWwgZGEgU2lsdmEgU29hcmVzIiwiY3VzdG9tIjp0cnVlLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYXJtcy1kZXYtZDE3YTMiLCJhdWQiOiJhcm1zLWRldi1kMTdhMyIsImF1dGhfdGltZSI6MTcxOTQxMDA5MSwidXNlcl9pZCI6InA5ekczUjNpMFNkVUZqZ20zY1hXRVVYR2lCNTIiLCJzdWIiOiJwOXpHM1IzaTBTZFVGamdtM2NYV0VVWEdpQjUyIiwiaWF0IjoxNzE5NDEwMDkxLCJleHAiOjE3MTk0MTM2OTEsImVtYWlsIjoiZGFuaWVsLnNvYXJlc0BpYXRlYy5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsibWljcm9zb2Z0LmNvbSI6WyIyZTQ5ZWM4Yy1jMzQ0LTQ5MGEtOTFjZi0xYTRhYzA4YTYwYzYiXSwiZW1haWwiOlsiZGFuaWVsLnNvYXJlc0BpYXRlYy5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJjdXN0b20ifX0.aHorOlhr-qaJG_tgAW9-s70lLu_9SIRln8kloL9mR6JxMvDIaatUQMU36FErhU0mcQlohoN5BfVuDWtYrqBtfqXYU4HSPno0voadbuMgTradLvLx8tyfwy2LN94xLXyJL9nQgzPVF2gn0gR2FmD5N2hO57lWaKjF57x8g7zC4TH4kPmHKrMVxbY2y9kWPKVBQZzCT2dYtiOgfXFcJrs11pu0nNlEml9n1RR83FUJKFgh2X5Xze_xdzSsb1S3_VwC79sHz0MwN7tVNkO2ivvW_KAK6ExGk4bqqh1dVTcWc1FtgUUK8BIIo3dXX4pb5sDS-YWEQMLmaKZsGsqxPxiSSQ';
  private connection: signalR.HubConnection;
  private chatUpdatedSubject: Subject<Message> = new Subject<Message>();
  public chatUpdated$: Observable<Message> =
    this.chatUpdatedSubject.asObservable();
  public closeConnection: boolean = false;

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Debug)
      .withUrl('http://localhost:5030/hub', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
        accessTokenFactory: () => this.token,
      })
      .withAutomaticReconnect()
      .build();

    this.starConnection();

    this.connection.onclose(error => {
      if (!this.closeConnection){
        this.starConnection();
      }
    });

    this.connection.on('messageReceived', (chat: Message) => {
      console.log('Message received: ', chat);
      this.chatUpdatedSubject.next(chat);
    });
  }

  private async starConnection(attemptsLimit: number = 1000): Promise<boolean> {
    this.closeConnection = false;
    let attempt = 1;
    while (true) {
      try {
        await this.connection.start();
        console.assert(
          this.connection.state === signalR.HubConnectionState.Connected
        );
        console.log('SignalR Connected.');
        return true;
      } catch (err) {
        console.assert(
          this.connection.state === signalR.HubConnectionState.Disconnected
        );
        console.log(`SignalR connection failed, error: ${err}`);


        if (attempt <= attemptsLimit) {
          console.log(`SignalR Connection failed: ${attempt} attempts, next attempt in 10 seconds`);
          await new Promise(resolve => setTimeout(resolve, 10000));
        } else {
          console.log(`SignalR Connection failed: ${attempt} attempts, no more attempts`);
          return false;
        }

        attempt++;
      }
    }
  }

  public sendMessage(message: Message) {
    this.connection
      .invoke('newMessage', message)
      .then(() => console.log('Message sent'))
      .catch((err) => console.error('Error sending message: ', err));
  }

  public joinGroup(groupName: string, author: string) {
    this.connection
      .invoke('joinGroup', groupName, author)
      .then(() => console.log('Joined group: ', groupName))
      .catch((err) => console.error('Error joining group: ', err));
  }

  public leaveGroup(groupName: string, author: string) {
    this.connection
      .invoke('leaveGroup', groupName, author)
      .then(() => console.log('Left group: ', groupName))
      .catch((err) => console.error('Error leaving group: ', err));
  }
}
