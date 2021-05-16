import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faSmile } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  faSmile = faSmile;
  form: any = {
    username1: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
token:any;
  constructor(private http:HttpClient,private router:Router ) { }

  ngOnInit(): void {
  }
  onSubmit(): void {
    const { username1, password } = this.form;
let body = {
  regno:username1,
  password:password
}
this.http.post('http://localhost:3000'+ '/login',body).subscribe((response:any)=>{
  console.log(response);
  if (response['status'] == 200 || response['status']==500) {
        
      this.isLoggedIn = true
    this.token=response['token'];
    localStorage.setItem('token',response['token']);
    localStorage.setItem('regno',response['regno']);
  alert('You have successfully Logged In')
  this.router.navigateByUrl('/room');
  }
  else {
    alert("Login Failed")
  
  }
          
    });
   
  }
}
