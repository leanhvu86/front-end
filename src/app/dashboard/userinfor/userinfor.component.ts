import { Component, OnInit } from '@angular/core';
import { Options } from "ng5-slider";
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/shared/service/user.service.';
import { CookieService } from 'ngx-cookie-service';
import { LoginServiceService } from 'src/app/shared/service/login-service.service';
import { User } from 'src/app/shared/model/user';

@Component({
  selector: 'app-userinfor',
  templateUrl: './userinfor.component.html',
  styleUrls: ['./userinfor.component.css']
})
export class UserinforComponent implements OnInit {
  id: String = '1'
  user: User
  loadPage: boolean = false
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private cookie: CookieService,
    private _loginService: LoginServiceService
  ) { }

  ngOnInit() {
    this.getUser()
  }
  value: number = 0;
  options: Options = {
    floor: 0,
    ceil: 4,
    showOuterSelectionBars: true,
    showTicksValues: false
  };

  getUser() {
    let email = this.cookie.get('email');
    if (email !== '') {
      this._loginService.testEmail(email).subscribe(data => {
        let user = data.body['user'];
        if (user !== undefined) {
          this.user = user
          this.id = user._id
          console.log(this.id)
          this.loadPage = true
          if (user.totalPoint > 600) {
            this.value = 4
            user.level = 'Mastee'
          } else if (user.totalPoint > 400) {
            this.value = 3
            user.level = 'Cheffe'
          } else if (user.totalPoint > 250) {
            this.value = 2
            user.level = 'Cookee'
          } else if (user.totalPoint > 100) {
            this.value = 1
            user.level = 'Tastee'
          } else {
            this.value = 0
            user.level = 'Newbee'
          }
          this.loadPage = true
        }
      })
    }
  }

  onSubmit() {

  }
}
