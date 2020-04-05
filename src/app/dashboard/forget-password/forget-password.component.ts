import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/service/user.service.';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  registerForm: FormGroup;
  email: string = ''
  message: string = ''
  userObject = {
    email: "",
    password: ""
  }
  submitted = false;
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private _router: Router,
  ) {

  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
    const radio: HTMLElement = document.getElementById('close-modal');
    radio.click();
  }

  get f() { return this.registerForm.controls; }

  getPassword() {
    this.submitted = true;
    if (!this.registerForm.valid) {
      return
    }
    this.userObject = this.registerForm.value
    this.userObject.password = this.userObject.email
    console.log(this.userObject)
    this.userService.changePassword(this.userObject).subscribe(data => {
      const result = data.body
      if (result['status'] === 200) {
        this.message = result['message'];
        setTimeout(() => {
          this._router.navigate(['/']);
        }, 5000);
      } else {
        this.message = result['message'];
      }
    })

  }
}
