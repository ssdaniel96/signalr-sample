import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RealtimeService {
  private connection: signalR.HubConnection;
  private chatUpdatedSubject: Subject<any> = new Subject<any>();
  public chatUpdated$: Observable<any> = this.chatUpdatedSubject.asObservable();


  constructor() {
    this.connection = new signalR.HubConnectionBuilder().withUrl('https://localhost:5030/hub').build();

    this.connection.start()
    .then(() => console.log('Logged to SignalR Hub'))
    .catch(err => console.error('Error connecting to SignalR hub: ', err));

    this.connection.on('Pending chat updated', (chat: any) => {
      this.chatUpdatedSubject.next(chat);
    });
  }

  // public async orderFoodItem(foodId: number, table: number) {
  //   console.log("ordering");
  //   await this.hubConnection.invoke('OrderFoodItem', {
  //     foodId,
  //     table,
  //   } as FoodRequest);
  // }

  // public async updateFoodItem(orderId: number, state: OrderState) {
  //   await this.hubConnection.invoke('UpdateFoodItem', orderId, state);
  // }
}
