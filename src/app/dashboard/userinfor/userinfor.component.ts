import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Options } from "ng5-slider";
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/shared/service/user.service.';
import { CookieService } from 'ngx-cookie-service';
import { LoginServiceService } from 'src/app/shared/service/login-service.service';
import { User } from 'src/app/shared/model/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-userinfor',
  templateUrl: './userinfor.component.html',
  styleUrls: ['./userinfor.component.css']
})
export class UserinforComponent implements OnInit {
  id: String = '1'
  user: User
  loadPage: boolean = false
  errorMessage: string = null;
  registerForm: FormGroup
  submitted = false;
  message: string = '';
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
  }
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private cookie: CookieService,
    private _loginService: LoginServiceService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
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
          let name = this.user.name
          if (name === undefined) {
            name = ''
          }
          let lastName = this.user.lastName
          if (lastName === undefined) {
            lastName = ''
          }
          let birthday: Date
          console.log(this.user.birthday)
          if (this.user.birthday === undefined) {
            birthday = null
          } else {
            birthday = new Date(this.user.birthday.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"))
            console.log(birthday)
          }
          let gender = this.user.gender
          if (gender === undefined) {
            gender = '1'
          }
          let materialStatus = this.user.materialStatus
          if (materialStatus === undefined) {
            materialStatus = '1'
          }
          let signature = this.user.signature
          if (signature === undefined) {
            signature = ''
          } else {
            signature = atob(signature)
          }
          let introduction = this.user.introduction
          if (introduction === undefined) {
            introduction = ''
          }
          this.registerForm = this.formBuilder.group({
            id: [this.user._id],
            email: [email, [Validators.required, Validators.email]],
            name: [name],
            lastName: [lastName],
            birthday: [birthday],
            gender: [gender],
            materialStatus: [materialStatus],
            signature: [signature],
            introduction: [introduction],
          });
          console.log(this.registerForm.value)
        }
      })

    }

  }

  get f() { return this.registerForm.controls; }

  value: number = 0;
  options: Options = {
    floor: 0,
    ceil: 4,
    showOuterSelectionBars: true,
    showTicksValues: false
  };

  onSubmit() {
    this.submitted = true;
    this.userObject = this.registerForm.value
    this.userObject.birthday = this.datePipe.transform(this.userObject.birthday, 'dd/MM/yyyy');
    this.userObject.signature = btoa(this.userObject.signature);
    this.userService.updateUser(this.userObject).subscribe(user => {
      if (user != undefined) {
        console.log(user)
        this.user.signature = atob(this.user.signature)
        this.message = user.body['message']
        const radio: HTMLElement = document.getElementById('modal-button2');
        radio.click();
        setTimeout(() => {
          const radio: HTMLElement = document.getElementById('close-modal');
          radio.click();
        }, 4000);
      }
    })
  }
  onClear() {
    this.submitted = false;
    this.registerForm.reset()
  }
}
