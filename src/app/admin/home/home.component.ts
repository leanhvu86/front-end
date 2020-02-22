import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from 'src/app/shared/service/login-service.service';
import { CookieService } from 'ngx-cookie-service';
import { Token } from 'src/app/shared/model/token';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  tfa: Token;
  authcode: string = "";
  errorMessage: string = null;
  emailObject = {
    email: ""
  }
  constructor(private _loginService: LoginServiceService, private cookie: CookieService) {
    // this.getAuthDetails();
  }

  ngOnInit() {
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



}
