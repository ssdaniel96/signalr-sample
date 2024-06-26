import { SessionService } from './session.service';
import { Inject, Injectable, OnDestroy, inject } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Message } from '../components/models/message';

@Injectable({
  providedIn: 'root'
})
export abstract class RealtimeService implements OnDestroy {
  protected connection: signalR.HubConnection;
  public closeConnection: boolean = false;

  constructor(
    @Inject('hubUrl') private hubUrl: string,
    private SessionService: SessionService) {

    if (!hubUrl) {
      throw new Error('Hub URL is required');
    }

    this.connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Warning)
      .withUrl(`http://localhost:5030/hubs/${hubUrl}`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
        accessTokenFactory: () => this.SessionService.jwtToken,
      })
      .withAutomaticReconnect()
      .build();

    this.starConnection();

    this.connection.onclose(error => {
      if (!this.closeConnection){
        this.starConnection();
      }
    });
  }

  async ngOnDestroy(): Promise<void> {
    console.log('RTS: Passou por aqui')
    await this.stopConnection().then(() => {
      console.log(`RealtimeService: ${this.hubUrl} stop the conneciton`);
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
        console.log(`SignalR Connected to Hub ${this.hubUrl}.`);
        return true;
      } catch (err) {
        console.assert(
          this.connection.state === signalR.HubConnectionState.Disconnected
        );
        console.log(`SignalR connection to hub ${this.hubUrl} failed, error: ${err}`);


        if (attempt <= attemptsLimit) {
          console.log(`SignalR Connection to hub ${this.hubUrl} failed: ${attempt} attempts, next attempt in 10 seconds`);
          await new Promise(resolve => setTimeout(resolve, 10000));
        } else {
          console.log(`SignalR Connection to hub ${this.hubUrl} failed: ${attempt} attempts, no more attempts`);
          return false;
        }

        attempt++;
      }
    }
  }

  public async stopConnection() {
    this.closeConnection = true;
    await this.connection.stop();
    console.assert(
      this.connection.state === signalR.HubConnectionState.Disconnected
    );
    console.log(`SignalR Disconnected from Hub ${this.hubUrl}.`);
  }
}
