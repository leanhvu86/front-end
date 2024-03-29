import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Title} from '@angular/platform-browser';
import {CookieService} from 'ngx-cookie-service';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginServiceService} from '../../shared/service/login-service.service';
import {UserService} from 'src/app/shared/service/user.service.';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Message} from '../../shared/model/message';
import {LoadingBarService} from 'ngx-loading-bar';
import {catchError} from 'rxjs/operators';
import {AppSetting} from '../../appsetting';
import * as io from 'socket.io-client';
import {ChatService} from 'src/app/shared/service/chat.service';

// socket

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  socket;
  BASE_IMAGE_URL = AppSetting.BASE_IMAGE_URL;

  registerForm: FormGroup;
  submitted = false;

  tfaFlag: boolean = false;
  userObject = {
    email: '',
    password: ''
  };

  data = {
    name: '',
    userId: ''
  };
  public href: string = '';
  id: string = '1';
  noImage: string = 'avatar.png';
  imageUrl: string = this.BASE_IMAGE_URL;
  message = '';
  url = 'http://amthuc.anchay.vn:4200/';
  text = 'Chào mừng bạn đến với website Ẩm thực Ăn chay';
  isModeration: boolean = false;
  showModal: boolean = false;
  addPassenger: boolean = false;
  addGallery: boolean = true;
  errorMessage: string = null;
  isAuthenicate: boolean = false;
  userMessage: Message[] = [];
  newMessage: boolean = false;
  mailBoxEmpty = false;
  search: string = '';
  user = '';
  height = 3;
  color = 'rgb(111, 250, 123)';
  runInterval = 300;

  constructor(
    private title: Title,
    private translate: TranslateService,
    private cookie: CookieService,
    private _loginService: LoginServiceService,
    private _router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private chatService: ChatService
  ) {
    translate.setDefaultLang('vi');
    sessionStorage.setItem('currentLang', 'vi');
    this.mailBox();
    let body = document.getElementsByTagName('body')[0];
    body.style.backgroundImage = 'none';
  }

  ngOnInit() {
    this.translate.get('Ẩm thực món chay').subscribe(name => {
      this.title.setTitle(name);
    });
    this.isModeration = localStorage.getItem('role') !== '';
    this.isAuthenicate = localStorage.getItem('email') !== '';
    this.getImage();
    this.getMessage();
    this.registerForm = this.formBuilder.group({

      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  mailBox() {
    this.chatService.getMessages().subscribe(mail => {
      console.log(mail);
      if (mail !== undefined) {
        this.newMessage = true;
        let mess = new Message;
        mess.content = mail;
        mess.news = true;
        console.log(mess);
        this.userMessage.push(mess);
        console.log(this.userMessage);
      }
    });
  }

  getImage() {
    let email = localStorage.getItem('email');
    if (email !== '') {
      this._loginService.testEmail(email).subscribe(data => {
        let user = data.body['user'];
        if (user !== undefined && user.imageUrl !== '') {
          this.imageUrl = this.BASE_IMAGE_URL + user.imageUrl;
          console.log('this.imageUrl' + this.imageUrl);
        }
        if (user !== undefined) {

          this.id = user._id;
          this.user = user.name;
        }
      });
    }
  }

  changeStatus(event: any) {
    this.newMessage = false;
  }

  getMessage() {
    this.userMessage = [];
    let email = localStorage.getItem('email');
    if (email !== '') {
      this.userObject.email = email;
      this.userService.findMessage(this.userObject).subscribe(data => {
        let temp = data.body['message'];
        for (let mess of temp) {
          if (mess.news === 1) {
            this.newMessage = true;
            mess.news = true;
          } else {
            mess.news = false;
          }
          this.userMessage.push(mess);
        }
        if (this.userMessage.length === 0) {
          this.mailBoxEmpty = true;
        }
      });
    }
  }

  loginUser() {
    this.submitted = true;


    if (this.registerForm.invalid) {
      return;
    }

    this._loginService.loginAuth(this.userObject).subscribe((userData) => {
      this.errorMessage = null;
      if (userData.body['status'] === 200) {
        this._loginService.updateAuthStatus(true);


        let user = userData.body;
        let role;
        for (let key in user) {
          if (key === 'role') {
            role = user[key];
          }
          if (key === 'image') {
            this.imageUrl = this.BASE_IMAGE_URL + user[key];
          }
          if (parseInt(role) === -1) {
            this.errorMessage = 'Bạn chưa xác thực email đã đăng ký';
            return;
          }
          if (key === 'user') {
            let users = user[key];
            this.id = users._id;
            this.user = users.name;
            localStorage.setItem('token', users.token);
            localStorage.setItem('isAuthenicate', '1');
          }
          if (key === 'role') {
            role = user[key];
            localStorage.setItem('role', role);
            if (role !== undefined && role !== '') {
              this.isModeration = true;
              console.log(role);
            }
          }
          if (key === 'objectId') {
            let ObjectId = user[key];
            localStorage.setItem('ObjectId', ObjectId);
            console.log(ObjectId);
          }
        }
        this.showModal = false;
        const radio: HTMLElement = document.getElementById('close-modal');
        radio.click();
        localStorage.setItem('user', this.userObject.email);
        localStorage.setItem('email', this.userObject.email);
        this.isAuthenicate = true;
        this.getMessage();
        this.href = this._router.url;

        this.message = '';
        if (this.addPassenger == true) {
          console.log('true');
          this._router.navigate(['/addRecipe']);
          this.addPassenger = false;
        } else if (this.href === '/index') {
          window.location.reload();
        } else {
          console.log('reload');

          this._router.navigate(['/index']);
          // this._router.navigate(['/index']);
        }
        this.socket = io(AppSetting.BASE_SERVER_URL);
        // this.data.name = this.cookie.get('ObjectId');
        // this.data.userId = this.socket['id'];
        // console.log(this.socket);
        // this.socket.emit('setSocketId', this.data);
      }
      if (userData.body['status'] === 206) {
        this.tfaFlag = true;
      }
      if (userData.body['status'] !== 200) {
        this.errorMessage = userData.body['message'];
      }
      if (userData.body['status'] === 404) {
        this.errorMessage = userData.body['message'];
      }
    });
  }

  onChange(value: any) {
    if (this.isAuthenicate === false) {
      console.log('false');
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      this.addPassenger = true;
    } else {
      console.log('true');
      this._router.navigate(['/addRecipe']);
    }
  }

  onChangecheck(value: any) {
    const radio: HTMLElement = document.getElementById('modal-button');
    radio.click();
  }

  redirect() {
    if (this.isModeration === false) {
      alert('Vui lòng liên hệ với ban quản trị để được phép đăng nhập');

    } else {

      this._router.navigate(['/loadPage']);
    }
  }

  findRecipe() {
    console.log(this.search);
    if (this.search === undefined) {
      this.search = '';
    }
    localStorage.setItem('searchText', this.search);
    this._router.navigateByUrl('/recipe', {skipLocationChange: true}).then(() => {
      this._router.navigate(['/recipe']);
    });

    this.search = '';
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
    this.isAuthenicate = false;
    this.showModal = false;
    let token = localStorage.getItem('token');
    if (token !== '') {
      localStorage.setItem('token', '');
    }
    this.href = this._router.url;
    console.log(this.href);
    if (this.href === '/index') {
      window.location.reload();
    } else {
      this._router.navigate(['/']);
    }
    this.cookie.deleteAll();

  }

  openSendMail() {
    const url = 'https://mail.google.com/mail/?view=cm&fs=1&to=amthuc.anchay.2020@gmail.com&su=Thư Góp Ý&body=Xin Chào ban quản trị website Ẩm thực Ăn chay! ';
    window.open(url, 'MsgWindow', 'width=800,height=600');
  }
}
