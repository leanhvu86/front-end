import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { LoginServiceService } from 'src/app/shared/service/login-service.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  tfaFlag: boolean = false
  userObject = {
    email: "",
    password: ""
  }
  errorMessage: string = null
  constructor(private _loginService: LoginServiceService, private _router: Router, private cookie: CookieService) {
  }

  ngOnInit() {
  }

  loginUser() {
    console.log(this.userObject.email + " user đăng nhập");
    this._loginService.loginAuth(this.userObject).subscribe((data) => {
      this.errorMessage = null;
      if (data.body['status'] === 200) {
        this._loginService.updateAuthStatus(true);
        this._router.navigateByUrl('/adminHome');
        let user = data.body;
        for (let key in user) {
          if (key === 'user') {
            let users = user[key];
            console.log(users.token);
            this.cookie.set('token', users.token);
          }

        }
        sessionStorage.setItem('user', this.userObject.email);
        this.cookie.set('email', this.userObject.email);
      }
      if (data.body['status'] === 206) {
        this.tfaFlag = true;
      }
      if (data.body['status'] === 403) {
        this.errorMessage = data.body['message'];
      }
      if (data.body['status'] === 404) {
        this.errorMessage = data.body['message'];
      }
    })
  }

}
