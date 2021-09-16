import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm, ReactiveFormsModule } from '@angular/forms';

import { LoginServiceService } from 'src/app/shared/service/login-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MustMatch } from 'src/app/shared/helper/must-match-validator';
import {AlertService} from '../../shared/animation/_alert';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  errorMessage: string = null;
  registerForm: FormGroup;
  submitted = false;
  message: string = null;
  userObject = {
    user: '',
    password: '',
    email: ''
  };

  confirmPass = '';

  constructor(
    private loginService: LoginServiceService,
    private router: Router,
    private formBuilder: FormBuilder,
    private alertService: AlertService
    ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({

      user: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
    const radio: HTMLElement = document.getElementById('close-modal');
    radio.click();
  }
  get f() { return this.registerForm.controls; }

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
  }
  changeIndexPage() {
    this.router.navigate(['/']);
  }
  registerUser() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    if (this.userObject.user.trim() !== '' && this.userObject.password.trim() !== ''
      && this.userObject.email.trim() !== '' && (this.userObject.password.trim() === this.confirmPass))
      console.log(this.userObject);
    this.loginService.registerUser(this.userObject).subscribe((data) => {
      const result = data.body;
      if (result['status'] === 200) {
        this.message = result['message'];
        this.alertService.success(this.message);
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000);
      } else if (result['status'] !== 200) {
        this.errorMessage = result['message'];
        this.alertService.error(this.errorMessage);

      }

    });
  }
}
