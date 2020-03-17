import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MustMatch } from '../../_helpers/must-match.validator';
import { LoginServiceService } from 'src/app/shared/service/login-service.service';
import { Router } from '@angular/router';


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
    user: "",
    password: "",
    email: ""
  }

  confirmPass: string = ""

  constructor(
    private _loginService: LoginServiceService,
    private _router: Router,
    private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({

      user: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }
  get f() { return this.registerForm.controls; }

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
  }
  registerUser() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    if (this.userObject.user.trim() !== "" && this.userObject.password.trim() !== ""
      && this.userObject.email.trim() !== "" && (this.userObject.password.trim() === this.confirmPass))
      console.log(this.userObject);
    this._loginService.registerUser(this.userObject).subscribe((data) => {
      const result = data.body
      console.log(result['status'] + "fdsfsfd")
      if (result['status'] === 200) {
        this.message = result['message'];
        const radio: HTMLElement = document.getElementById('modal-button');
        radio.click();
        setTimeout(() => {
          this._router.navigate(['/']);
        }, 5000);
      } else if (result['status'] !== 200) {
        this.errorMessage = result['message'];
      }

    });
  }
}