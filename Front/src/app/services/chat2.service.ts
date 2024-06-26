import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { Message } from '../components/models/message';
import { Observable, Subject } from 'rxjs';
import { RealtimeService } from './realtime.service';

@Injectable({
  providedIn: 'root'
})
export class Chat2Service extends RealtimeService {
  private chatUpdatedSubject: Subject<Message> = new Subject<Message>();
  public chatUpdated$: Observable<Message> = this.chatUpdatedSubject.asObservable();

  constructor(private sessionService: SessionService) {
    super('chat2', sessionService);

    this.connection.on('messageReceived', (chat: Message) => {
      console.log('Chat2Service: Message received: ', chat);
      this.chatUpdatedSubject.next(chat);
    });
  }

  public sendMessage(message: Message) {
    this.connection
      .invoke('newMessage', message)
      .then(() => console.log('Chat2Service: Message sent'))
      .catch((err) => console.error('Chat2Service: Error sending message: ', err));
  }

  public joinGroup(groupName: string, author: string) {
    this.connection
      .invoke('joinGroup', groupName, author)
      .then(() => console.log('Chat2Service: Joined group: ', groupName))
      .catch((err) => console.error('Chat2Service: Error joining group: ', err));
  }

  public leaveGroup(groupName: string, author: string) {
    this.connection
      .invoke('leaveGroup', groupName, author)
      .then(() => console.log('Chat2Service: Left group: ', groupName))
      .catch((err) => console.error('Chat2Service: Error leaving group: ', err));
  }
}
