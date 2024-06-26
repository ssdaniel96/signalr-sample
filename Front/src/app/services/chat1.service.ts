import { Injectable, OnDestroy } from '@angular/core';
import { RealtimeService } from './realtime.service';
import { SessionService } from './session.service';
import { Message } from '../components/models/message';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class Chat1Service extends RealtimeService {
  private chatUpdatedSubject: Subject<Message> = new Subject<Message>();

  public chatUpdated$: Observable<Message> = this.chatUpdatedSubject.asObservable();

  constructor(private sessionService: SessionService) {
    super('chat1', sessionService);

    this.connection.on('messageReceived', (chat: Message) => {
      console.log('Chat1Service: Message received: ', chat);
      this.chatUpdatedSubject.next(chat);
    });
  }

  public sendMessage(message: Message) {
    this.connection
      .invoke('newMessage', message)
      .then(() => console.log(`Chat1Service: Message sent to hub`))
      .catch((err) => console.error('Chat1Service: Error sending message: ', err));
  }

  public joinGroup(groupName: string, author: string) {
    this.connection
      .invoke('joinGroup', groupName, author)
      .then(() => console.log('Chat1Service: Joined group: ', groupName))
      .catch((err) => console.error('Chat1Service: Error joining group: ', err));
  }

  public leaveGroup(groupName: string, author: string) {
    this.connection
      .invoke('leaveGroup', groupName, author)
      .then(() => console.log('Chat1Service: Left group: ', groupName))
      .catch((err) => console.error('Chat1Service: Error leaving group: ', err));
  }
}
