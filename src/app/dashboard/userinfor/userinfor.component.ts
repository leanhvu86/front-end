import {Component, OnInit, AfterViewInit} from '@angular/core';
import {Options} from 'ng5-slider';
import {ActivatedRoute} from '@angular/router';
import {UserService} from 'src/app/shared/service/user.service.';
import {CookieService} from 'ngx-cookie-service';
import {LoginServiceService} from 'src/app/shared/service/login-service.service';
import {User} from 'src/app/shared/model/user';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {MustMatch} from 'src/app/shared/helper/must-match-validator';
import {ChatService} from 'src/app/shared/service/chat.service';
import {AppSetting} from '../../appsetting';
import {AlertService} from '../../shared/animation/_alert';

@Component({
  selector: 'app-userinfor',
  templateUrl: './userinfor.component.html',
  styleUrls: ['./userinfor.component.css']
})
export class UserinforComponent implements OnInit {
  id: String = '1';
  user: User;
  loadPage: boolean = false;
  errorMessage: string = null;
  registerForm: FormGroup;
  changePassForm: FormGroup;
  submitted = false;
  passSubmitted = false;
  errorPassMessage: string = '';
  message: string = '';
  BASE_IMAGE_URL = AppSetting.BASE_IMAGE_URL;
  userPassObject = {
    user: '',
    password: '',
    newPassword: ''
  };
  userObject = {
    id: '',
    email: '',
    name: '',
    lastName: '',
    birthday: '',
    gender: '',
    materialStatus: '',
    signature: '',
    introduction: '',
    imageUrl: '',
  };
  loading = false;
  isAuthenicate: boolean = false;
  years: number[] = [];
  imageUrl: string = this.BASE_IMAGE_URL + 'avatar.png';
  imageProp = 'profile';
  originUrl: any;
  private hasBaseDropZoneOver1 = false;

  value: number = 0;
  options: Options = {
    floor: 0,
    ceil: 1000,
    showTicksValues: false,
    disabled: true,
    hideLimitLabels: true,
  };

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private cookie: CookieService,
    private _loginService: LoginServiceService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private chatService: ChatService,
    private alertService: AlertService
  ) {
    this.isAuthenicate = localStorage.getItem('email') !== '';
  }

  fileOverBase1(e: any): void {
    console.log(e);
    this.hasBaseDropZoneOver1 = e;
  }

  choosefile() {

    const radio: HTMLElement = document.getElementById('fileChoose');
    radio.click();
  }

  ngOnInit() {
    this.chatService.scrollToTop();
    this.changePassForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });

    this.getAllYear();
    const email = localStorage.getItem('email');
    if (email !== '') {
      this._loginService.testEmail(email).subscribe(data => {
        let user = data.body['user'];
        if (user !== undefined) {
          this.user = user;
          this.id = user._id;
          console.log(this.id);
          this.loadPage = true;
          if (user.totalPoint > 600) {
            this.value = user.totalPoint;
            user.level = 'Mastee';
          } else if (user.totalPoint > 400) {
            this.value = user.totalPoint;
            user.level = 'Cheffe';
          } else if (user.totalPoint > 250) {
            this.value = user.totalPoint;
            user.level = 'Cookee';
          } else if (user.totalPoint > 100) {
            this.value = user.totalPoint;
            user.level = 'Tastee';
          } else {
            this.value = user.totalPoint;
            user.level = 'Newbee';
          }
          this.loadPage = true;
          let name = this.user.name;
          if (name === undefined) {
            name = '';
          }
          let lastName = this.user.lastName;
          if (lastName === undefined) {
            lastName = '';
          }
          let birthday = this.user.birthday;
          if (this.user.birthday === undefined) {
            birthday = 1900;
          }
          let gender = this.user.gender;
          if (gender === undefined) {
            gender = '1';
          }
          let materialStatus = this.user.materialStatus;
          if (materialStatus === undefined) {
            materialStatus = '1';
          }
          let signature = this.user.signature;
          if (signature === undefined) {
            signature = '';
          } else {
            signature = atob(signature);
          }
          let introduction = this.user.introduction;
          if (introduction === undefined) {
            introduction = '';
          }
          if (this.user.imageUrl !== undefined) {
            this.imageUrl = this.BASE_IMAGE_URL + this.user.imageUrl;
            this.originUrl = this.user.imageUrl;
          }
          this.registerForm = this.formBuilder.group({
            id: [this.user._id],
            email: [email, [Validators.required, Validators.email]],
            name: [name, [Validators.required, Validators.maxLength(20)]],
            lastName: [lastName],
            birthday: [birthday],
            gender: [gender],
            materialStatus: [materialStatus],
            signature: [signature],
            introduction: [introduction],
          });
          console.log(this.registerForm.value);
        }
      });

    }

  }

  getImageSrc(event: any) {
    const imageRes = JSON.parse(event);
    console.log(imageRes.filePath);
    this.originUrl = imageRes.filePath;
  }

  get f() {
    return this.registerForm.controls;
  }

  get f1() {
    return this.changePassForm.controls;
  }

  changePass() {
    this.passSubmitted = true;
    if (this.changePassForm.invalid) {
      this.message = 'Không để trống các trường mật khẩu';
      const radio: HTMLElement = document.getElementById('modal-button2');
      radio.click();
      return;
    }
    this.loading = true;
    let email = localStorage.getItem('email');
    this.userPassObject = this.changePassForm.value;
    this.userPassObject.user = email;
    this.userService.changePassword(this.userPassObject)
      .subscribe(data => {
        console.log(data);
        const status = data.body['status'];
        if (status === 200) {
          this.message = data.body['message'];
          this.alertService.success(this.message);
          setTimeout(() => {
            this.loading = false;
            window.location.reload();
            this.chatService.identifyUser();
          }, 3000);
        } else {
          this.loading = false;
          this.errorPassMessage = data.body['message'];
        }
      });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Bạn phải kiểm tra lại thông tin!';
      return;
    }

    this.userObject = this.registerForm.value;
    this.userObject.imageUrl = this.originUrl;

    if (this.userObject !== undefined || this.userObject.signature !== '') {

      const pattern = new RegExp('^[a-zA-Z0-9 ]*$');
      if (!pattern.test(this.userObject.signature)) {
        this.errorMessage = 'Chữ ký chỉ chứa kí tự chữ số! Không chứa ký tự đặc biệt và UTF-8';
        return;
      }
      this.userObject.signature = btoa(this.userObject.signature);
    } else {
      this.userObject.signature = '';
    }

    this.submitted = true;
    this.loading = true;
    this.registerForm.value.id = this.user._id;
    console.log(this.registerForm.value);
    this.userService.updateUser(this.userObject).subscribe(user => {

      const status = user.body['status'];
      console.log(status);
      if (status === 200) {
        console.log(user);
        if (this.user.signature !== undefined) {
          this.user.signature = atob(this.user.signature);
        }
        this.loading = false;
        this.message = user.body['message'];
        this.alertService.success(this.message);
        this.loading = false;
        setTimeout(() => {

          window.location.reload();
          this.chatService.identifyUser();
        }, 4000);
      } else {
        this.loading = false;
        this.errorMessage = user.body['message'];
      }
    });

  }

  onClear() {
    this.submitted = false;
    this.registerForm.value.email = '';
    this.registerForm.value.name = '';
    this.registerForm.value.lastName = '';
    this.registerForm.value.birthday = '';
    this.registerForm.value.gender = 3;
    this.registerForm.value.materialStatus = 5;
    this.registerForm.value.signature = '';
    this.registerForm.value.introduction = '';
  }

  getAllYear() {
    let temp = parseInt(new Date().getFullYear().toString()) - 4;

    for (let i = 0; i < 100; i++) {
      let year = (temp - i);
      this.years.push(year);
    }

  }
}
