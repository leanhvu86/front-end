import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { LoginServiceService } from '../../shared/service/login-service.service'
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  tfaFlag: boolean = false
  userObject = {
    email: "",
    password: ""
  }
  message = '';
  isModeration: boolean = false;
  showModal: boolean = false;
  addPassenger: boolean = false;
  addGallery: boolean = true;
  errorMessage: string = null
  isAuthenicate: boolean = false;
  constructor(
    private title: Title,
    private translate: TranslateService,
    private cookie: CookieService,
    private _loginService: LoginServiceService,
    private _router: Router
  ) {

    translate.setDefaultLang('vi');
    sessionStorage.setItem('currentLang', 'vi');
  }

  ngOnInit() {
    this.translate.get('Ẩm thực món chay').subscribe(name => {
      this.title.setTitle(name);
    });
    this.isModeration = this.cookie.get('role') !== '' ? true : false;
    console.log(this.isModeration)
    this.isAuthenicate = this.cookie.get('email') !== "" ? true : false;
    console.log(this.cookie.get('email') + 'email nè');

  }
  loginUser() {
    console.log(this.userObject.email + " user đăng nhập");
    this._loginService.loginAuth(this.userObject).subscribe((data) => {
      this.errorMessage = null;
      if (data.body['status'] === 200) {
        this._loginService.updateAuthStatus(true);


        let user = data.body;
        for (let key in user) {
          if (key === 'user') {
            let users = user[key];
            console.log(users.token);
            this.cookie.set('token', users.token);
            this.cookie.set('isAuthenicate', '1');
          }
          if (key === 'role') {
            let role = user[key];
            this.cookie.set('role', role);
            console.log(role)
            if (role !== undefined && role !== '') {
              this.isModeration = true
              console.log(role)
            }
          }
        }
        this.showModal = false;
        const radio: HTMLElement = document.getElementById('close-modal');
        radio.click();
        sessionStorage.setItem('user', this.userObject.email);
        this.cookie.set('email', this.userObject.email);
        this.isAuthenicate = true;
        if (this.addPassenger == true) {
          console.log('true');
          this._router.navigate(['/addPassenger']);

        } else {
          this._router.navigate(['/index']);
        }
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
  onChange(value: any) {
    if (this.isAuthenicate === false) {
      console.log('false');
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      this.addPassenger = true;
    } else {
      console.log('true')
      this._router.navigate(['/addPassenger']);
    }
  }
  onChangecheck(value: any) {
    const radio: HTMLElement = document.getElementById('modal-button');
    radio.click();
  }
  redirect() {
    if (this.isModeration === false) {
      alert('Vui lòng liên hệ với ban quản trị để được phép đăng nhập')

    } else {

      this._router.navigate(['/adminHome']);
    }
  }
  useLanguage(language: string) {
    this.translate.use(language);
    console.log(language);
    if (language === 'en') {
      this.translate.get('Vegeterian Cookery').subscribe(name => {
        this.title.setTitle(name);
      });
    } else {
      this.translate.get('Ẩm thực món chay').subscribe(name => {
        this.title.setTitle(name);
      });
    }
    sessionStorage.setItem('currentLang', language);

  }
  logout() {
    console.log('logout');
    this._loginService.logoutUser();
    this._router.navigate(['/index']);
    this.isAuthenicate = false;
    this.showModal = false;
    let token = this.cookie.get('token');
    if (token !== '') {
      this.cookie.set('token', '');
    }
  }
}
