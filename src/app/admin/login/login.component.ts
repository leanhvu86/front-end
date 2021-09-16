import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoginServiceService} from 'src/app/shared/service/login-service.service';
import {CookieService} from 'ngx-cookie-service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  registerForm: FormGroup;
  tfaFlag: boolean = false;
  userObject = {
    email: '',
    password: ''
  };
  submitted: boolean = false;
  errorMessage: string = null;

  constructor(private cookie: CookieService,
              // tslint:disable-next-line:variable-name
              private _loginService: LoginServiceService,
              // tslint:disable-next-line:variable-name
              private _router: Router,
              private formBuilder: FormBuilder,
              private title: Title) {
    let body = document.getElementsByTagName('body')[0];
    body.style.backgroundImage = 'url(../../../assets/images/wallpaperflare.com_wallpaper.png)';
    body.style.height = '100%';
    body.style.backgroundPosition = 'center';
    body.style.backgroundRepeat = 'no-repeat';
    body.style.backgroundSize = 'cover';
  }

  ngOnInit() {
    this.title.setTitle('Trang quản trị Ẩm thực Món chay');
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  loginUser() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }
    console.log(this.userObject.email + ' user đăng nhập');
    this._loginService.loginAdmin(this.userObject).subscribe((data) => {
      this.errorMessage = null;
      if (data.body['status'] === 200) {

        let user = data.body;
        let role;
        let token;
        let users;
        for (let key in user) {
          if (key === 'user') {
            users = user[key];
            console.log(user);
            token = users.token;
            console.log(users.token);
          } else if (key === 'role') {
            role = user[key];
            console.log(role);

          }

        }
        if (role === -1) {
          this.errorMessage = 'Bạn chưa xác thực email đã đăng ký';
          return;
        }
        if (role < 1) {
          console.log('member');
          this.errorMessage = 'Bạn không có thẩm quyền truy cập';
          return;
        } else {
          localStorage.setItem('token', token);
          localStorage.setItem('role', role);
          sessionStorage.setItem('token', token);
          localStorage.setItem('isAuthenicate', 'true');
          localStorage.setItem('email', this.userObject.email);
          sessionStorage.setItem('user', this.userObject.email);
          this._loginService.updateAuthStatus(true);
          this._router.navigateByUrl('/loadPage');
        }


      }
      if (data.body['status'] === 206) {
        this.tfaFlag = true;
      }
      if (data.body['status'] !== 200) {
        this.errorMessage = data.body['message'];
      }
      if (data.body['status'] === 404) {
        this.errorMessage = data.body['message'];
      } else {
        this.errorMessage = data.body['message'];
      }

    });
  }

}
