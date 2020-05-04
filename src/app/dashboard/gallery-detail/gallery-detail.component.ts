import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  galleryCheck: boolean = false;
  gallery: Gallery;
  checkRecipe: boolean = false;
  public recipes: Recipe[] = [];
  public recipesTemp: Recipe[] = [];
  userObject = {
    email: '',
    password: ''
  };
  addRecipe: any;
  message: String = '';
  errormessage = '';
  personalCheck: boolean = false;
  imageUrl: String = 'jbiajl3qqdzshdw0z749';
  isAuthenicate: boolean = false;
  personalGallery: Gallery[] = [];
  gallerys: Gallery[] = [];
  mine: boolean = false;
  p: number;
  galleryObject = {
    _id: "",
    recipe: Recipe
  };
  constructor(
    private route: ActivatedRoute,
    private galleryService: GalleryService,
    private cookie: CookieService,
    private recipeService: RecipeService,
    private _loginService: LoginServiceService,
    private userService: UserService,
    private _router: Router,
  ) {
    this.isAuthenicate = this.cookie.get('email') !== '' ? true : false;
    this.id = this.route.snapshot.params.id;
  }

  ngOnInit() {

    this.personalCheck = false;
    this.galleryCheck = false;
    this.getGalleryDetail(this.id, true);
  }

  getGalleryDetail(id: any, first: boolean) {
    this.userObject.email = this.cookie.get('email');

    this.galleryService.galleryDetail(id).subscribe(data => {
      this.gallery = data['gallery'];
      if (this.gallery !== undefined) {
        if (this.gallery.recipe.length > 0) {
          this.checkRecipe = true;
          this.recipes = this.gallery.recipe;
          if (this.userObject.email !== undefined) {
            this.recipeService.findInterest(this.userObject).subscribe(data => {
              let interests = data.body['interests'];
              console.log(data);
              this.recipes.forEach(function (recipe) {
                recipe.like = false;
                if (interests !== undefined) {
                  for (let interest of interests) {
                    if (interest.objectId._id === recipe._id) {
                      recipe.like = true;
                    }
                  }
                }
                if (recipe.user.imageUrl === undefined) {
                  recipe.user.imageUrl = 'jbiajl3qqdzshdw0z749';
                }
              });
            });

          }
        } else {
          this.recipes = this.recipesTemp;
        }
        if (this.gallery.user.imageUrl !== '') {
          this.imageUrl = this.gallery.user.imageUrl;
        }
        if (first === true) {
          this.getPersonalGallery();
        }

      }
      if (this.userObject.email === this.gallery.user.email) {
        this.mine = true;
      }
    });
    const radio: HTMLElement = document.getElementById('scroll-to-top');
    radio.click();
  }

  getPersonalGallery() {
    let email = this.cookie.get('email');


    this.galleryService.getGalleryies().subscribe(data => {
      console.log(data);

      if (data != null) {
        let emailUser = this.gallery.user.email;
        console.log(emailUser);
        if (emailUser !== '') {
          for (let gallery of data) {
            if (gallery.user.email === emailUser) {
              if (gallery.recipe.length > 0) {
                gallery.image = gallery.recipe[0].imageUrl;
              } else {
                gallery.image = 'fvt7rkr59r9d7wk8ndbd';
              }
              this.gallerys.push(gallery);
            }
          }
          if (this.gallerys.length > 0) {
            this.personalCheck = true;

          }
        }
        if (email !== '') {
          for (let gallery of data) {
            if (gallery.user.email === email) {
              if (gallery.recipe.length > 0) {
                gallery.image = gallery.recipe[0].imageUrl;
              } else {
                gallery.image = 'fvt7rkr59r9d7wk8ndbd';
              }
              this.personalGallery.push(gallery);
            }
          }
          if (this.personalGallery.length > 0) {

            console.log(this.personalGallery.length);
          }
        }
      }
    });
  }

  video(link: any) {
    var url
    if (link.includes('https:')) {
      url = link;
    } else {
      url = 'https://www.youtube.com/watch?v=' + link;
    }
    window.open(url, 'MsgWindow', 'width=600,height=400');
  }

  likeRecipe(recipe: any, index: any) {
    console.log(recipe);
    console.log(index);
    this.isAuthenicate = this.cookie.get('email') !== '' ? true : false;
    if (this.isAuthenicate === false) {
      console.log('false');
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      return;
    }
    recipe.like = true;
    console.log(recipe.user.email);
    let user = this.cookie.get('email');
    let interestObject = new Object({
      user: user,
      objectId: recipe,
      objectType: '2'
    });
    let id = 'heart' + index;
    const radio: HTMLElement = document.getElementById(id);
    radio.style.color = 'red';
    radio.style.opacity = '0.8';
    console.log(interestObject);
    this.recipeService.likeRecipe(interestObject).subscribe((data) => {
      if (data !== undefined) {
        console.log('success');
        let userObject = new Object({
          email: recipe.user.email
        });
        // this.userService.likeAddPoint(userObject).subscribe((data) => {
        //   if (data.body['status'] === 200) {
        //     console.log('success');
        //
        //   }
        // });
      }
    });
    console.log(recipe.like);
  }

  loadGallery(gallery) {
    this.getGalleryDetail(gallery._id, false);

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
    console.log(recipe.user.email);
    let user = this.cookie.get('email');
    let interestObject = new Object({
      user: user,
      objectId: recipe,
      objectType: '2'
    });
    let id = 'heart' + index;
    const radio: HTMLElement = document.getElementById(id);
    radio.style.color = 'white';
    radio.style.opacity = '0.4';
    console.log(recipe.user.email);
    console.log(interestObject);
    this.recipeService.dislikeRecipe(interestObject).subscribe((data) => {
      if (data !== undefined) {
        let userObject = new Object({
          email: recipe.user.email
        });
        // this.userService.dislikeremovePoint(userObject).subscribe((data) => {
        //   if (data.body['status'] === 200) {
        //     console.log('success');
        //
        //   }
        // });
      }


    });
    console.log(recipe.like);
  }
  addBookmark(recipe: Recipe) {
    this.message = ''
    if (this.isAuthenicate !== true) {
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      return;
    }
    this.addRecipe = recipe
    const radio: HTMLElement = document.getElementById('modal-button1');
    radio.click();
  }
  addRecipeBookMark(gallery: any) {
    if (gallery.recipe !== undefined) {
      for (let recipe of gallery.recipe) {
        if (recipe.name === this.addRecipe.name) {
          this.errormessage = 'Công thức đã có trong bộ sưu tập';
          return;
        }
      }
    }
    this.galleryObject._id = gallery._id;
    this.galleryObject.recipe = this.addRecipe;
    this.galleryService.addGallery(this.galleryObject).subscribe(data => {
      if (data.body['status'] === 200) {
        let gallery = data.body['gallery'];
        this.message = data.body['message'];
        setTimeout(() => {
          const radio: HTMLElement = document.getElementById('close-modal');
          radio.click();
          window.location.reload()
        }, 4000);

      }
    })
  }
}
