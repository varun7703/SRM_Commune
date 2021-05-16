import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faSmile } from '@fortawesome/free-solid-svg-icons';
import { Message } from '../models/message.model';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { CryptographyService } from '../cryptography.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  message: string;
  users = [];
  messages: Message[] = [];
  faComment = faComment;
  faPaperPlane = faPaperPlane;
  faUsers = faUsers;
  faSmile = faSmile;
  roomName: string;
bot = false;
  encKey = 'deiulfhwueWUIG==90u7'

  constructor(private chatService: ChatService, private cryptographyService: CryptographyService, private router: Router) { }

  ngOnInit(): void {
    this.chatService.onMessage()
      .subscribe((message) => {
        if (message.username !== "Student Commune Bot") {
          let messageDec = this.cryptographyService.decText(message.text, this.encKey);
          message.text = messageDec;
          console.log(message);
        }
        this.messages.push(message);
      });
    this.roomUsers();
  }

  sendMessage() {
    let messageEnc = this.cryptographyService.encText(this.message, this.encKey);
    console.log(messageEnc);
    this.chatService.sendMessage(messageEnc);
    this.message = '';
  }

  roomUsers() {
    this.chatService.getRoomUsers()
      .subscribe(({ room, users }) => {
        this.roomName = room;
        this.users = users;
      })
  }

  leaveRoom() {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
      this.chatService.disconnect();
      this.router.navigate(['/room']);
    } else { }

  }


}