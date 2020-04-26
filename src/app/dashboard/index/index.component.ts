import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginServiceService } from '../../shared/service/login-service.service';
import { UserService } from 'src/app/shared/service/user.service.';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from '../../shared/model/message';
import { LoadingBarService } from "ngx-loading-bar";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;

  tfaFlag: boolean = false
  userObject = {
    email: "",
    password: ""
  }
  public href: string = "";
  id: string = '1'
  imageUrl: string = 'jbiajl3qqdzshdw0z749'
  message = '';
  url = 'http://localhost:4200'
  text = 'Chào mừng bạn đến với website Ẩm thực Ăn chay'
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
  color = "rgb(111, 250, 123)";
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
    private loadingBarService: LoadingBarService
  ) {
    this.emitStart()
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
    this.getMessage();
    this.registerForm = this.formBuilder.group({

      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  emitStart() {
    this.loadingBarService.start();
  }
  getImage() {
    let email = this.cookie.get('email');
    if (email !== '') {
      this._loginService.testEmail(email).subscribe(data => {
        let user = data.body['user'];
        if (user !== undefined && user.imageUrl !== '') {
          this.imageUrl = user.imageUrl

        }
        if (user !== undefined) {

          this.id = user._id
          this.user = user.name;
        }
      })
    }
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
        if (this.userMessage.length === 0) {
          this.mailBoxEmpty = true;
        }
      })
    }
  }
  loginUser() {
    this.submitted = true;


    if (this.registerForm.invalid) {
      return;
    }

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
            this.id = users._id
            console.log(this.id);
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
        this.getMessage();
        this.href = this._router.url;
        if (this.addPassenger == true) {
          console.log('true');
          this._router.navigate(['/addPassenger']);
          this.addPassenger = false;
        } else if (this.href = '/register') {
          this._router.navigate(['/index']);
        }
        else {
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

      this._router.navigate(['/loadPage']);
    }
  }
  emitStop() {
    this.loadingBarService.stop();
  }

  emitReset() {
    this.loadingBarService.reset();
  }

  emitComplete() {
    this.loadingBarService.complete();
  }
  findRecipe() {
    console.log(this.search)
    if (this.search === undefined) {
      this.search = ''
    }
    this.cookie.set('searchText', this.search);
    this._router.navigateByUrl('/recipe', { skipLocationChange: true }).then(() => {
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
    let token = this.cookie.get('token');
    if (token !== '') {
      this.cookie.set('token', '');
    }
    this.href = this._router.url;
    console.log(this.href)
    if (this.href === '/index') {
      window.location.reload();
    } else {
      this._router.navigate(['/'])
    }
    this.cookie.deleteAll();

  }

  openSendMail() {
    let url = 'https://mail.google.com/mail/?view=cm&fs=1&to=amthuc.anchay.2020@gmail.com&su=Thư Góp Ý&body=Xin Chào ban quản trị website Ẩm thực Ăn chay! ';
    window.open(url, "MsgWindow", "width=800,height=600");
  }
}
