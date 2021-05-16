import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { faSmile } from '@fortawesome/free-solid-svg-icons';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  faSmile = faSmile;
  username: string;
  room: string;
  
  constructor(private chatService: ChatService,private http:HttpClient) { }

  ngOnInit(): void {
    this.username = localStorage.getItem('regno');
  }

  joinRoom() {
    this.chatService.onJoinRoom(this.username, this.room);
  }
 
}
