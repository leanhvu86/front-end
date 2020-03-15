import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Recipe } from 'src/app/shared/model/recipe';
import { RecipeService } from 'src/app/shared/service/recipe-service.service';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/shared/service/user.service.';
import { LoginServiceService } from 'src/app/shared/service/login-service.service';
import { Router } from '@angular/router';

declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class Home2Component implements OnInit {
  public recipes: Recipe[] = [];
  config: any;
  userObject = {
    email: "",
    password: ""
  }
  tfaFlag: boolean = false
  errorMessage: string = null
  showModal: boolean = false;
  isAuthenicate: boolean = false;
  searchText;
  collection = { count: 60, data: [] };
  constructor(
    private translate: TranslateService,
    private cookie: CookieService,
    private recipeService: RecipeService,
    private _loginService: LoginServiceService,
    private userService: UserService,
    private _router: Router) {
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
  }
  pageChanged(event) {
    this.config.currentPage = event;
  }
  loginUser() {
    console.log(this.userObject.email + " user đăng nhập");
    this._loginService.loginAuth(this.userObject).subscribe((data) => {
      this.errorMessage = null;
      if (data.body['status'] === 200) {
        this._loginService.updateAuthStatus(true);


        let user = data.body;
        for (let key in user) {
          if (key === 'user') {
            let users = user[key];
            console.log(users.token);
            this.cookie.set('token', users.token);
          }

        }
        this.showModal = false;
        const radio: HTMLElement = document.getElementById('close-modal');
        radio.click();
        sessionStorage.setItem('user', this.userObject.email);
        this.cookie.set('email', this.userObject.email);
        this.isAuthenicate = true;
        this._router.navigate(['/index']);

      }
      if (data.body['status'] === 206) {
        this.tfaFlag = true;
      }
      if (data.body['status'] === 403) {
        this.errorMessage = data.body['message'];
      }
      if (data.body['status'] === 404) {
        this.errorMessage = data.body['message'];
      }
    })
  }
  getRecipes() {
    this.recipeService.getRecipes().subscribe(recipes => {
      recipes.forEach(function (recipe) {
        recipe.like = false;
        console.log(recipe);
      });
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
      console.log(this.recipes);
    });
  }
  video(link: any) {
    console.log(link)
    var url = 'https://www.google.com/?hl=hi';
    window.open(url);
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
    recipe.like = false;
    console.log(recipe.user.email)
    let user = recipe.user;
    this.isAuthenicate = this.cookie.get('email') !== "" ? true : false;
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


