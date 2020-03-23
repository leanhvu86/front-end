import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GalleryService } from 'src/app/shared/service/gallery.service';
import { Gallery } from 'src/app/shared/model/gallery';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

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
  galleryTop: Gallery[] = [];
  constructor(
    private cookie: CookieService,
    private formBuilder: FormBuilder,
    private galleryService: GalleryService
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
    this.getPersonalGallery()
    this.getTopGalleries()
  }

  get f() { return this.registerForm.controls; }

  registerGallery() {
    console.log('add')
    const radio: HTMLElement = document.getElementById('modal-button');
    radio.click();
  }
  getTopGalleries() {
    this.galleryService.getTopGalleryies().subscribe(galleries => {

      for (let gallery of galleries) {

        if (gallery.recipe.length > 0) {
          console.log(gallery.recipe.length)
          gallery.image = gallery.recipe[0].imageUrl
        } else {
          console.log(gallery.recipe.length)
          gallery.image = 'fvt7rkr59r9d7wk8ndbd'
        }
      }
      this.galleryTop = galleries
      console.log(this.galleryTop)
    })
  }
  getPersonalGallery() {
    let email = this.cookie.get('email')

    if (email !== '') {
      this.galleryService.getGalleryies().subscribe(data => {
        console.log(data)
        if (data != null) {
          for (let gallery of data) {
            if (gallery.user.email === email) {
              if (gallery.recipe.length > 0) {
                gallery.image = gallery.recipe[0].imageUrl
              } else {
                gallery.image = 'fvt7rkr59r9d7wk8ndbd'
              }
              this.gallerys.push(gallery)
            }
          }
        }
      })
    }
  }
  addGallery() {
    this.submitted = true;
    this.galleryObject = this.registerForm.value
    let email = this.cookie.get('email')
    this.galleryObject.user = email
    console.log(this.galleryObject)
    this.galleryService.createGallery(this.galleryObject).subscribe(gallery => {
      console.log(gallery)
      if (gallery !== undefined) {
        const radio: HTMLElement = document.getElementById('close-modal');
        radio.click();
        this.message = 'Chúc mừng bạn thêm bộ sưu tập thành công'
        let tem = new Gallery
        tem = gallery.body['gallery']
        if (tem.image == '') {
          tem.image = 'fvt7rkr59r9d7wk8ndbd'
        }
        this.registerForm.reset()
        this.gallerys.push(tem)
      }
    })
  }
}
