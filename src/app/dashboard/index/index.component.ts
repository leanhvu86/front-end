import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { LoginServiceService } from '../../shared/service/login-service.service'
import { UserService } from 'src/app/shared/service/user.service.';
import { User } from 'src/app/shared/model/user';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
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
  imageUrl: string = 'jbiajl3qqdzshdw0z749'
  message = '';
  isModeration: boolean = false;
  showModal: boolean = false;
  addPassenger: boolean = false;
  addGallery: boolean = true;
  errorMessage: string = null
  isAuthenicate: boolean = false;
  userMessage: Message[] = [];
  newMessage: boolean = false
  constructor(
    private title: Title,
    private translate: TranslateService,
    private cookie: CookieService,
    private _loginService: LoginServiceService,
    private _router: Router,
    private userService: UserService
  ) {

    translate.setDefaultLang('vi');
    sessionStorage.setItem('currentLang', 'vi');
  }

  ngOnInit() {
    this.translate.get('Ẩm thực món chay').subscribe(name => {
      this.title.setTitle(name);
    });
    this.isModeration = this.cookie.get('role') !== '' ? true : false;
    this.isAuthenicate = this.cookie.get('email') !== "" ? true : false;
    this.getImage();
    this.getMessage()
  }
  getImage() {
    let email = this.cookie.get('email');
    this._loginService.testEmail(email).subscribe(data => {
      let user = data.body['user'];
      if (user !== undefined && user.imageUrl !== '') {
        this.imageUrl = user.imageUrl
        console.log(user)
      }
    })
  }
  changeStatus(event: any) {
    this.newMessage = false
  }
  getMessage() {
    this.userMessage = [];
    let email = this.cookie.get('email');
    if (email !== '') {
      this.userObject.email = email
      this.userService.findMessage(this.userObject).subscribe(data => {
        let temp = data.body['message']
        for (let mess of temp) {
          if (mess.news === 1) {
            this.newMessage = true
            mess.news = true
          } else {
            mess.news = false
          }
          this.userMessage.push(mess)
        }
      })
    }
  }
  loginUser() {
    console.log(this.userObject.email + " user đăng nhập");
    this._loginService.loginAuth(this.userObject).subscribe((data) => {
      this.errorMessage = null;
      if (data.body['status'] === 200) {
        this._loginService.updateAuthStatus(true);


        let user = data.body;
        let role;
        for (let key in user) {
          if (key === 'role') {
            role = user[key];
          }
          if (key === 'image') {
            this.imageUrl = user[key];
          }
          if (parseInt(role) === -1) {
            this.errorMessage = 'Bạn chưa xác thực email đã đăng ký';
            return;
          }
          if (key === 'user') {
            let users = user[key];
            console.log(users.token);
            this.cookie.set('token', '');
            this.cookie.set('token', users.token);
            this.cookie.set('isAuthenicate', '');
            this.cookie.set('isAuthenicate', '1');
          }
          if (key === 'role') {
            role = user[key];
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
        this.cookie.set('email', '');
        this.cookie.set('email', this.userObject.email);
        this.isAuthenicate = true;
        this.getMessage()
        if (this.addPassenger == true) {
          console.log('true');
          this._router.navigate(['/addPassenger']);
          this.addPassenger = false;
        } else {
          window.location.reload()
          // this._router.navigate(['/index']);
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
