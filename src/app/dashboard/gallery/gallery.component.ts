import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GalleryService } from 'src/app/shared/service/gallery.service';
import { Gallery } from 'src/app/shared/model/gallery';
import { RecipeService } from 'src/app/shared/service/recipe-service.service';
import { UserService } from 'src/app/shared/service/user.service.';

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
    private galleryService: GalleryService,
    private recipeService: RecipeService,
    private userService: UserService
  ) {
    this.isAuthenicate = this.cookie.get('email') !== "" ? true : false;
    console.log(this.isAuthenicate)
    const radio: HTMLElement = document.getElementById('start-loading');
    radio.click();
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
          gallery.image = gallery.recipe[0].imageUrl
        } else {
          console.log(gallery.recipe.length)
          gallery.image = 'fvt7rkr59r9d7wk8ndbd'
        }
      }
      this.galleryTop = galleries
      if (this.isAuthenicate == true) {
        this.userObject.email = this.cookie.get('email')
        this.recipeService.findInterestGallery(this.userObject).subscribe(data => {
          let interests = data.body['interests']
          if (interests !== undefined) {
            for (let galler of this.galleryTop) {
              for (let interest of interests) {
                if (interest.objectId._id === galler._id && interest.objectType === '1') {
                  galler.like = true
                }
              }
            }
          }
        })
      }
      const radio: HTMLElement = document.getElementById('complete-loading');
      radio.click();
    })
  }
  likeGallerry(gallery: any, index: any) {

    console.log(gallery);
    console.log(index);
    this.isAuthenicate = this.cookie.get('email') !== "" ? true : false;
    if (this.isAuthenicate === false) {
      console.log('false');
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      return;
    }
    gallery.like = true;
    console.log(gallery.user.email)
    let user = this.cookie.get('email');
    let interestObject = new Object({
      user: user,
      objectId: gallery,
      objectType: '1'
    })
    let id = 'heartGallery' + index;
    const radio: HTMLElement = document.getElementById(id);
    radio.style.color = 'red';
    radio.style.opacity = '0.8';
    console.log(interestObject)
    this.recipeService.likeRecipe(interestObject).subscribe((data) => {
      if (data !== undefined) {
        console.log('success')
        let userObject = new Object({
          email: gallery.user.email
        })
        this.userService.likeAddPoint(userObject).subscribe((data) => {
          if (data.body['status'] === 200) {
            console.log('success')

          }
        });
      }
    });
    console.log(gallery.like);
  }
  nolikeGallery(gallery: any, index: any) {
    gallery.like = false;
    console.log(gallery);
    console.log(index);
    if (this.isAuthenicate !== true) {
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      return;
    }
    gallery.like = false;
    console.log(gallery.user.email)
    let user = this.cookie.get('email');
    let interestObject = new Object({
      user: user,
      objectId: gallery,
      objectType: '1'
    })
    let id = 'heartGallery' + index;
    const radio: HTMLElement = document.getElementById(id);
    radio.style.color = 'grey';
    radio.style.opacity = '0.5';
    console.log(gallery.user.email)
    console.log(interestObject)
    this.recipeService.dislikeRecipe(interestObject).subscribe((data) => {
      if (data !== undefined) {
        let userObject = new Object({
          email: gallery.user.email
        })
        this.userService.dislikeremovePoint(userObject).subscribe((data) => {
          if (data.body['status'] === 200) {
            console.log('success')

          }
        });
      }


    })
    console.log(gallery.like);
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
        }, 5000);

      }
    })
  }
}
