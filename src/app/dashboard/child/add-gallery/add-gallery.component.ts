import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Gallery } from 'src/app/shared/model/gallery';
import { CookieService } from 'ngx-cookie-service';
import { GalleryService } from 'src/app/shared/service/gallery.service';
import { UserService } from 'src/app/shared/service/user.service.';

@Component({
  selector: 'app-add-gallery',
  templateUrl: './add-gallery.component.html',
  styleUrls: ['./add-gallery.component.css']
})
export class AddGalleryComponent implements OnInit {
  submitted: boolean = false;
  registerForm: FormGroup;
  isAuthenicate: boolean;
  galleryObject = {
    content: "",
    image: "",
    name: "",
    user: ""
  };
  userObject = {
    email: "",
    password: ""
  }
  message: String = ''
  gallerys: Gallery[] = [];
  constructor(
    private cookie: CookieService,
    private formBuilder: FormBuilder,
    private galleryService: GalleryService,
    private userService: UserService
  ) {
    this.isAuthenicate = this.cookie.get('email') !== "" ? true : false;
    console.log(this.isAuthenicate)
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      content: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]]
      // , image: ['']
    });
  }

  get f() { return this.registerForm.controls; }

  registerGallery() {
    console.log('add')
    const radio: HTMLElement = document.getElementById('modal-button555');
    radio.click();
  }
  addGallery() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    this.galleryObject = this.registerForm.value
    let email = this.cookie.get('email')
    this.galleryObject.user = email
    console.log(this.galleryObject)
    this.galleryService.createGallery(this.galleryObject).subscribe(gallery => {
      console.log(gallery)
      if (gallery !== undefined) {

        this.message = 'Chúc mừng bạn thêm bộ sưu tập thành công'
        let tem = new Gallery
        tem = gallery.body['gallery']
        if (tem.image == '') {
          tem.image = 'fvt7rkr59r9d7wk8ndbd'
        }

        this.gallerys.push(tem)
        setTimeout(() => {
          const radio: HTMLElement = document.getElementById('close-modal');
          radio.click();
          this.message = ''
          this.registerForm.reset()
          window.location.reload()
        }, 5000);

      }
    })
  }
}
