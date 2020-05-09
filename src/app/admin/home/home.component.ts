import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from 'src/app/shared/service/login-service.service';
import { CookieService } from 'ngx-cookie-service';
import { Token } from 'src/app/shared/model/token';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/shared/service/chat.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  imageUrl: string = '';
  image: boolean = false;
  tfa: Token;
  authcode: string = "";
  errorMessage: string = null;
  emailObject = {
    email: ""
  }
  user = '';
  id = '';
  newMessage: string;
  messageList: string[] = [];
  constructor(
    private _loginService: LoginServiceService,
    private cookie: CookieService,
    private _router: Router,
    private chatService: ChatService
  ) {
    // this.getAuthDetails();
  }
  sendMessage() {
    this.chatService.sendMessage(this.newMessage);
    this.newMessage = '';
  }
  ngOnInit() {
    this.getImage();
    this.chatService
      .getMessages()
      .subscribe((message: string) => {
        this.messageList.push(message);
      });
  }
  getImage() {
    let email = this.cookie.get('email');
    this._loginService.testEmail(email).subscribe(data => {
      let user = data.body['user'];
      if (user !== undefined && user.imageUrl !== '') {
        this.imageUrl = user.imageUrl
        this.image = true;
        this.user = user.name;
        this.id = user._id;
      }
    })
  }
  getAuthDetails() {
    let email = this.cookie.get('email');
    console.log(email);
    this._loginService.verifyAuth(email).subscribe((data) => {
      const result = data.body;
      if (data['status'] === 200) {

        if (result == null) {
          console.log(result);
        } else {
          console.log(result);

          this.cookie.set('token', result[0]);
        }
      }
    });
  }

  logout() {
    this._loginService.logoutUser();
    this._router.navigate(['/login']);
  }
  openNav() {
    const radio: HTMLElement = document.getElementById("mySidebar");
    radio.style.width = "250px";
    const radio2: HTMLElement = document.getElementById("main");
    radio2.style.marginLeft = "250px";
    document.getElementById("menu-open").style.opacity = "0";
  }

  closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    document.getElementById("menu-open").style.opacity = "1";
  }
}
