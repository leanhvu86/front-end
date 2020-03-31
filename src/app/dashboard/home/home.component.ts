import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Recipe } from 'src/app/shared/model/recipe';
import { RecipeService } from 'src/app/shared/service/recipe-service.service';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/shared/service/user.service.';
import { LoginServiceService } from 'src/app/shared/service/login-service.service';
import { Router } from '@angular/router';
import { Interest } from 'src/app/shared/model/interest';
import { User } from 'src/app/shared/model/user';
import { GalleryService } from 'src/app/shared/service/gallery.service';
import { Gallery } from 'src/app/shared/model/gallery';
import { OrderPipe } from 'ngx-order-pipe';

declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class Home2Component implements OnInit {
  public recipes: Recipe[] = [];
  public interests: Interest[] = [];
  config: any;
  userObject = {
    email: "",
    password: ""
  }
  imageUrl: string = 'jbiajl3qqdzshdw0z749'
  topUsers: User[] = []
  tfaFlag: boolean = false
  errorMessage: string = null
  message: string = null
  showModal: boolean = false;
  isAuthenicate: boolean = false;
  searchText;
  collection = { count: 60, data: [] };
  galleryTop: Gallery[] = []
  personalGallery: Gallery[] = []
  addRecipe = Recipe
  galleryObject = {
    _id: "",
    recipe: Recipe
  };

  constructor(
    private translate: TranslateService,
    private cookie: CookieService,
    private recipeService: RecipeService,
    private _loginService: LoginServiceService,
    private userService: UserService,
    private _router: Router,
    private galleryService: GalleryService,
    private orderPipe: OrderPipe) {
    this.collection = orderPipe.transform(this.collection, 'info.name');
    translate.setDefaultLang('vi');
    for (var i = 0; i < this.collection.count; i++) {
      this.collection.data.push(
        {
          id: i + 1,
          value: "items number " + (i + 1)
        }
      );
    }

    this.config = {
      itemsPerPage: 8,
      currentPage: 1,
      totalItems: this.recipes.length
    };
    this.isAuthenicate = this.cookie.get('email') !== "" ? true : false;
    console.log(this.cookie.get('email') + 'email nè');
  }
  ngOnInit() {
    this.getRecipes();
    this.getTopUser()
    //this.getTopGalleries()
    this.getPersonalGallery()
  }
  pageChanged(event) {
    this.config.currentPage = event;
  }
  getTopGalleries() {
    this.galleryService.getTopGalleryies().subscribe(galleries => {
      console.log(galleries)
      for (let gallery of galleries) {
        gallery.like = false
        if (this.interests.length > 0) {
          for (let inter of this.interests) {

            if (gallery._id === inter.objectId._id) {
              gallery.like = true
              console.log(gallery)
            }
          }
        }
        if (gallery.recipe.length > 0) {
          gallery.image = gallery.recipe[0].imageUrl
        } else {
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
              this.personalGallery.push(gallery)
            }
          }
        }
      })
    }
  }
  addBookmark(recipe: any) {

    this.message = ''
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
    if (gallery.recipe !== undefined) {
      for (let recipe of gallery.recipe) {
        if (recipe.name === this.addRecipe.name) {
          this.message = 'Công thức đã có trong bộ sưu tập'
          return
        }
      }
    }
    this.galleryObject._id = gallery
    this.galleryObject.recipe = this.addRecipe
    console.log(this.galleryObject)
    this.galleryService.addGallery(this.galleryObject).subscribe(data => {
      if (data.body['status'] === 200) {
        let gallery = data.body['gallery']

        this.message = data.body['message']
        console.log(this.message)
        setTimeout(() => {
          const radio: HTMLElement = document.getElementById('close-modal');
          radio.click();
        }, 4000);

      }
    })
  }

  getRecipes() {
    this.recipeService.getRecipes().subscribe(recipes => {
      if (recipes !== undefined) {


        if (this.isAuthenicate == true) {
          this.userObject.email = this.cookie.get('email')
          if (this.userObject.email !== undefined || this.userObject.email !== '') {
            this.recipeService.findInterest(this.userObject).subscribe(data => {
              let interests = data.body['interests']
              this.interests = interests
              this.getTopGalleries()
              recipes.forEach(function (recipe) {
                recipe.like = false
                if (interests !== undefined) {
                  for (let interest of interests) {
                    if (interest.objectId._id === recipe._id && interest.objectType === '2') {
                      recipe.like = true
                    }
                  }
                }

                if (recipe.user.imageUrl === undefined) {
                  recipe.user.imageUrl = 'jbiajl3qqdzshdw0z749'
                }
              });
            })
          } else {
            recipes.forEach(function (recipe) {
              recipe.like = false
              if (recipe.user.imageUrl === undefined) {
                recipe.user.imageUrl = 'jbiajl3qqdzshdw0z749'
              }
            });
          }

        } else {
          this.getTopGalleries()
        }


        this.recipes = recipes;
        for (let recipe of this.recipes) {
          if (recipe.hardLevel !== undefined) {
            if (recipe.hardLevel === '') {
              recipe.hardLevel = 'Ko XĐ';
            } else if (recipe.hardLevel === '1') {
              recipe.hardLevel = 'Dễ';
            } else if (recipe.hardLevel === '2') {
              recipe.hardLevel = 'TB';
            } else if (recipe.hardLevel === '3') {
              recipe.hardLevel = 'Khó';
            } else if (recipe.hardLevel === '4') {
              recipe.hardLevel = 'R khó';
            }
          }
        }
      }

      console.log(this.recipes);
    });
  }
  video(link: any) {
    console.log(link)
    var url = 'https://www.youtube.com/watch?v=' + link;
    window.open(url, "MsgWindow", "width=600,height=400");
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
    let user = this.cookie.get('email');
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
          email: recipe.user.email
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
    let user = this.cookie.get('email');
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
          email: recipe.user.email
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
  getTopUser() {
    this.userService.getTopUsers().subscribe(users => {
      this.topUsers = users
      for (let user of this.topUsers) {
        if (user.imageUrl === undefined) {
          user.imageUrl = this.imageUrl
        }
      }
    })
  }
}


