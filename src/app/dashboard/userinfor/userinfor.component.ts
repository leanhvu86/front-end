import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Options } from "ng5-slider";
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/shared/service/user.service.';
import { CookieService } from 'ngx-cookie-service';
import { LoginServiceService } from 'src/app/shared/service/login-service.service';
import { User } from 'src/app/shared/model/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Cloudinary } from '@cloudinary/angular-5.x';
import { MustMatch } from 'src/app/shared/helper/must-match-validator';

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
  changePassForm: FormGroup
  submitted = false;
  passSubmitted = false;
  errorPassMessage: string = ''
  message: string = '';
  userPassObject = {
    user: "",
    password: "",
    newPassword: ""
  }
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
  }
  loading = false
  isAuthenicate: boolean = false
  years: number[] = []
  imageUrl: string = 'jbiajl3qqdzshdw0z749'
  private hasBaseDropZoneOver1 = false;
  constructor(
    private cloudinary: Cloudinary,
    private route: ActivatedRoute,
    private userService: UserService,
    private cookie: CookieService,
    private _loginService: LoginServiceService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) { this.isAuthenicate = this.cookie.get("email") !== "" ? true : false; }
  fileOverBase1(e: any): void {
    console.log(e);
    this.hasBaseDropZoneOver1 = e;
  }
  choosefile() {

    const radio: HTMLElement = document.getElementById("fileChoose");
    radio.click();
  }

  ngOnInit() {
    this.changePassForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });

    this.getAllYear();
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
            this.value = user.totalPoint
            user.level = 'Mastee'
          } else if (user.totalPoint > 400) {
            this.value = user.totalPoint
            user.level = 'Cheffe'
          } else if (user.totalPoint > 250) {
            this.value = user.totalPoint
            user.level = 'Cookee'
          } else if (user.totalPoint > 100) {
            this.value = user.totalPoint
            user.level = 'Tastee'
          } else {
            this.value = user.totalPoint
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
          let birthday = this.user.birthday
          if (this.user.birthday === undefined) {
            birthday = 1900
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
          if (this.user.imageUrl !== undefined) {
            this.imageUrl = this.user.imageUrl
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
          console.log(this.registerForm.value)
        }
      })

    }

  }

  get f() { return this.registerForm.controls; }
  get f1() { return this.changePassForm.controls; }

  value: number = 0;
  options: Options = {
    floor: 0,
    ceil: 1000,
    showTicksValues: false,
    disabled: true,
    hideLimitLabels: true,
  };
  changePass() {

    this.passSubmitted = true;
    if (this.changePassForm.invalid) {
      this.message = 'Không để trống các trường mật khẩu';
      const radio: HTMLElement = document.getElementById('modal-button2');
      radio.click();
      return;
    }
    this.loading = true;
    let email = this.cookie.get('email')
    this.userPassObject = this.changePassForm.value
    this.userPassObject.user = email
    this.userService.changePassword(this.userPassObject)
      .subscribe(data => {
        console.log(data)
        const status = data.body['status']
        if (status === 200) {
          this.message = data.body['message']
          const radio: HTMLElement = document.getElementById('modal-button2');
          radio.click();
          setTimeout(() => {
            this.loading = false;
            window.location.reload()
          }, 3000);
        } else {
          this.loading = false;
          this.errorPassMessage = data.body['message']
        }
      })
  }
  handleFiles(event: any, index: any) {
    const files = event.target.files;
    this.loading = true;
    console.log(files);
    if (files.length > 0) {
      let file: File
      file = files[0];
      if (file.size > 600000) {
        this.message = 'Kích thước file ảnh phải bé hơn 600 kB';
        const radio: HTMLElement = document.getElementById('modal-button2');
        radio.click();
        this.loading = false;
        return;
      } else {
        this.uploadFile(files[0]); // call the function to upload the file

      }
    }
  }
  uploadFile(file: any) {
    if (this.isAuthenicate == false) {
      const radio: HTMLElement = document.getElementById("modal-button");
      radio.click();
      return;
    }
    let inputValue;
    console.log(file);
    const url = `https://api.cloudinary.com/v1_1/${
      this.cloudinary.config().cloud_name
      }/image/upload`;
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

    // Update progress (can be used to show progress indicator)
    xhr.upload.addEventListener("progress", function (e) {
      const progress = Math.round((e.loaded * 100.0) / e.total);
      // document.getElementById('progress').style.width = progress + "%";

      console.log(`fileuploadprogress data.loaded: ${e.loaded},
    data.total: ${e.total}`);
    });
    xhr.onreadystatechange = function (e) {
      if (xhr.readyState == 4 && xhr.status == 200) {
        // File uploaded successfully
        const response = JSON.parse(xhr.responseText);
        const url = response.secure_url;
        // Create a thumbnail of the uploaded image, with 150px width
        const tokens = url.split("/");
        tokens.splice(-2, 0, "w_90,h_90,c_scale");
        inputValue = response.public_id;

        // const img = new Image(); // HTML5 Constructor
        // img.src = tokens.join("/");
        // img.alt = response.public_id;

        // const id = "imageArray";
        // inputValue = (document.getElementById(id) as HTMLInputElement).value;
        // img.id = id + "_";
        // img.onclick = function () {
        //   // xử lí xóa ảnh khi click thì  phải xóa ở trong imageArray( xóa public_id của ảnh trên cloud)
        //   document.getElementById(galleryID).removeChild(img);

        const id = "imageArray";

        const radio = document.getElementById(id) as HTMLInputElement;
        radio.value = inputValue;

        console.log(inputValue)
        //   console.log(inputValue);
        //   const arr = inputValue.split(",");
        //   console.log(arr);
        //   const id_tag = img.alt;
        //   const position = arr.indexOf(id_tag);

        //   if (~position) {
        //     arr.splice(position, 1);
        //   }

        //   // array = [2, 9]
        //   console.log(arr.toString());

        // };
        // inputValue = inputValue + response.public_id + ",";
        // inputValue = inputValue.trim();
        // console.log(inputValue);
        // const radio = document.getElementById(id) as HTMLInputElement;
        // radio.value = inputValue;

        // console.log(radio.value);
        // const galleryID = "gallery";
        // document.getElementById(galleryID).appendChild(img);
      }
    };
    const tags = "myphotoalbum";
    fd.append("upload_preset", this.cloudinary.config().upload_preset);
    fd.append("tags", tags); // Optional - add tag for image admin in Cloudinary
    fd.append("file", file);
    file.withCredentials = false;
    xhr.send(fd);

    setTimeout(() => {
      const id = "imageArray";
      const value = (document.getElementById(id) as HTMLInputElement)
        .value;
      if (value !== undefined && value !== '') {
        this.imageUrl = value
        console.log(this.imageUrl)
        this.onSubmit();
      } else {
        this.message = 'Lỗi mạng vui lòng thử lại với file dung lượng thấp hơn'
        const radio: HTMLElement = document.getElementById('modal-button2');
        radio.click();
      }
      this.loading = false;
    }, 16000);

  }
  onSubmit() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Bạn phải kiểm tra lại thông tin!'
      return;
    }

    this.submitted = true;
    this.loading = true;
    this.registerForm.value.id = this.user._id
    console.log(this.registerForm.value)
    this.userObject = this.registerForm.value
    this.userObject.imageUrl = this.imageUrl
    if (this.userObject !== undefined || this.userObject.signature !== '') {
      this.userObject.signature = btoa(this.userObject.signature);
    } else {
      this.userObject.signature = ''
    }
    this.userService.updateUser(this.userObject).subscribe(user => {

      const status = user.body['status']
      console.log(status)
      if (status === 200) {
        console.log(user)
        if (this.user.signature !== undefined) {
          this.user.signature = atob(this.user.signature)
        }
        this.loading = false;
        this.message = user.body['message']
        const radio: HTMLElement = document.getElementById('modal-button2');
        radio.click();
        this.loading = false;
        setTimeout(() => {

          window.location.reload();
        }, 4000);
      } else {
        this.loading = false;
        this.errorMessage = user.body['message']
      }
    })

  }
  onClear() {
    this.submitted = false;
    this.registerForm.value.email = ''
    this.registerForm.value.name = ''
    this.registerForm.value.lastName = ''
    this.registerForm.value.birthday = ''
    this.registerForm.value.gender = 3
    this.registerForm.value.materialStatus = 5
    this.registerForm.value.signature = ''
    this.registerForm.value.introduction = ''
  }
  getAllYear() {
    let temp = parseInt(new Date().getFullYear().toString()) - 4;

    for (let i = 0; i < 100; i++) {
      let year = (temp - i);
      this.years.push(year)
    }

  }
}
