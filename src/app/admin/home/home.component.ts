import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from 'src/app/shared/service/login-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  tfa: any = {};
  authcode: string = "";
  errorMessage: string = null;

  constructor(private _loginService: LoginServiceService) {
    this.getAuthDetails();
  }

  ngOnInit() {
  }

  getAuthDetails() {
    let email = sessionStorage.getItem('user');
    this._loginService.verifyAuth(email).subscribe((data) => {
      const result = data.body
      if (data['status'] === 200) {

        if (result == null) {
          console.log(result);
        } else {
          this.tfa = result;
        }
      }
    });
  }

  // setup() {
  //   let email = sessionStorage.getItem('email');
  //   this._loginService.setupAuth(email).subscribe((data) => {
  //     const result = data.body
  //     if (data['status'] === 200) {
  //       console.log(result);
  //       this.tfa = result;
  //     }
  //   });
  // }

  // confirm() {
  //   this._loginService.verifyAuth(this.authcode).subscribe((data) => {
  //     const result = data.body
  //     if (result['status'] === 200) {
  //       console.log(result);
  //       this.errorMessage = null;
  //       this.tfa.secret = this.tfa.tempSecret;
  //       this.tfa.tempSecret = "";
  //     } else {
  //       this.errorMessage = result['message'];
  //     }
  //   });
  // }

  // disabledTfa() {
  //   this._loginService.deleteAuth().subscribe((data) => {
  //     const result = data.body
  //     if (data['status'] === 200) {
  //       console.log(result);
  //       this.authcode = "";
  //       this.getAuthDetails();
  //     }
  //   });
  // }

}
