import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GalleryService } from 'src/app/shared/service/gallery.service';
import { Gallery } from 'src/app/shared/model/gallery';
import { Recipe } from 'src/app/shared/model/recipe';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/shared/service/user.service.';
import { LoginServiceService } from 'src/app/shared/service/login-service.service';
import { RecipeService } from 'src/app/shared/service/recipe-service.service';

@Component({
  selector: 'app-gallery-detail',
  templateUrl: './gallery-detail.component.html',
  styleUrls: ['./gallery-detail.component.css']
})
export class GalleryDetailComponent implements OnInit {

  id: string = '';
  gallery: Gallery
  checkRecipe: boolean = false
  public recipes: Recipe[] = []; userObject = {
    email: "",
    password: ""
  }
  message: String = ''
  galleryObject = {
    _id: "",
    recipe: Recipe
  };
  imageUrl: String = 'jbiajl3qqdzshdw0z749'
  isAuthenicate: boolean = false
  personalGallery: Gallery[] = []
  gallerys: Gallery[] = []
  addRecipe = Recipe
  constructor(
    private route: ActivatedRoute,
    private galleryService: GalleryService,
    private cookie: CookieService,
    private recipeService: RecipeService,
    private _loginService: LoginServiceService,
    private userService: UserService
  ) {
    this.isAuthenicate = this.cookie.get('email') !== "" ? true : false;
  }

  ngOnInit() {
    this.getGalleryDetail()
    this.getPersonalGallery()
  }
  getGalleryDetail() {

    this.id = this.route.snapshot.params.id;
    this.galleryService.galleryDetail(this.id).subscribe(data => {
      this.gallery = data['gallery']
      if (this.gallery.recipe.length > 0) {
        this.checkRecipe = true
        this.recipes = this.gallery.recipe
      }
      if (this.gallery.user.imageUrl !== '') {
        this.imageUrl = this.gallery.user.imageUrl
      }
    })
  }
  getPersonalGallery() {
    let email = this.cookie.get('email')

    if (email !== '') {
      this.galleryService.getGalleryies().subscribe(data => {
        console.log(data)

        if (data != null) {
          let emailUser = this.gallery.user.email
          if (emailUser !== '') {
            for (let gallery of data) {
              if (gallery.user.email === emailUser) {
                if (gallery.recipe.length > 0) {
                  gallery.image = gallery.recipe[0].imageUrl
                } else {
                  gallery.image = 'fvt7rkr59r9d7wk8ndbd'
                }
                this.gallerys.push(gallery)
              }
            }
          }
          for (let gallery of data) {
            if (gallery.user.email === email) {
              if (gallery.recipe.length > 0) {
                gallery.image = gallery.recipe[0].imageUrl
              } else {
                gallery.image = 'fvt7rkr59r9d7wk8ndbd'
              }
              this.personalGallery.push(gallery)
            }
          }
        }
      })
    }

  }
  addBookmark(recipe: any) {
    if (this.isAuthenicate !== true) {
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      return;
    }
    console.log(recipe)
    this.addRecipe = recipe
    const radio: HTMLElement = document.getElementById('modal-button1');
    radio.click();
  }
  addRecipeBookMark(gallery: any) {
    console.log(gallery)
    this.galleryObject._id = gallery
    this.galleryObject.recipe = this.addRecipe
    console.log(this.galleryObject)
    this.galleryService.addGallery(this.galleryObject).subscribe(data => {
      if (data.body['status'] === 200) {
        let gallery = data.body['gallery']
        console.log(gallery)
        this.message = data.body['message']
        setTimeout(() => {
          const radio: HTMLElement = document.getElementById('close-modal');
          radio.click();
        }, 5000);
      }
    })
  }
  likeRecipe(recipe: any, index: any) {
    console.log(recipe);
    console.log(index);
    this.isAuthenicate = this.cookie.get('email') !== "" ? true : false;
    if (this.isAuthenicate === false) {
      console.log('false');
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      return;
    }
    recipe.like = true;
    console.log(recipe.user.email)
    let user = recipe.user;
    let interestObject = new Object({
      user: user,
      objectId: recipe,
      objectType: '2'
    })
    let id = 'heart' + index;
    const radio: HTMLElement = document.getElementById(id);
    radio.style.color = 'red';
    radio.style.opacity = '0.8';
    console.log(interestObject)
    this.recipeService.likeRecipe(interestObject).subscribe((data) => {
      if (data !== undefined) {
        console.log('success')
        let userObject = new Object({
          email: user.email
        })
        this.userService.likeAddPoint(userObject).subscribe((data) => {
          if (data.body['status'] === 200) {
            console.log('success')

          }
        });
      }
    });
    console.log(recipe.like);
  }
  dislikeRecipe(recipe: any, index: any) {
    console.log(recipe);
    console.log(index);
    if (this.isAuthenicate !== true) {
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      return;
    }
    recipe.like = false;
    console.log(recipe.user.email)
    let user = recipe.user;
    let interestObject = new Object({
      user: user,
      objectId: recipe,
      objectType: '2'
    })
    let id = 'heart' + index;
    const radio: HTMLElement = document.getElementById(id);
    radio.style.color = 'white';
    radio.style.opacity = '0.4';
    console.log(recipe.user.email)
    console.log(interestObject)
    this.recipeService.dislikeRecipe(interestObject).subscribe((data) => {
      if (data !== undefined) {
        let userObject = new Object({
          email: user.email
        })
        this.userService.dislikeremovePoint(userObject).subscribe((data) => {
          if (data.body['status'] === 200) {
            console.log('success')

          }
        });
      }


    })
    console.log(recipe.like);
  }
}
