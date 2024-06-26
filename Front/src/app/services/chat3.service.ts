import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { Message } from '../components/models/message';
import { Observable, Subject } from 'rxjs';
import { RealtimeService } from './realtime.service';

@Injectable({
  providedIn: 'root'
})
export class Chat3Service extends RealtimeService {
  private chatUpdatedSubject: Subject<Message> = new Subject<Message>();
  public chatUpdated$: Observable<Message> = this.chatUpdatedSubject.asObservable();

  constructor(private sessionService: SessionService) {
    super('chat3', sessionService);

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
