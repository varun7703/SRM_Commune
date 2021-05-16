import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private url = 'http://localhost:3000';
  private socket;

  constructor() {
    this.socket = io(this.url);
   }

   //Join a chat room
   public onJoinRoom(username, room) {
     this.socket.connect();
    this.socket.emit('joinRoom', { username, room });
   }

   //Get room users
   public getRoomUsers() {
     return Observable.create((observer) => {
       this.socket.on('roomUsers', ({ room, users }) => {
         observer.next({ room, users });
       });
     });
   }

   //Message from Server
   public onMessage() {
     return Observable.create((observer) => {
       this.socket.on('message', message => {
         observer.next(message);
       })
     })
   }

   public disconnect() {
    this.socket.disconnect();
   }

   //Message Submit
   public sendMessage(message) {
     this.socket.emit('chatMessage', message);
   }

  //  public getMessages = () => {
  //     return Observable.create((observer) => {
  //       this.socket.on('new-message', (message) => {
  //         observer.next(message);
  //       });
  //     });
  //  }

}
