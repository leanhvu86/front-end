import {Component, OnInit} from '@angular/core';
import {Options} from 'ng5-slider';
import {LoginServiceService} from 'src/app/shared/service/login-service.service';
import {CookieService} from 'ngx-cookie-service';
import {User} from 'src/app/shared/model/user';
import {RecipeService} from 'src/app/shared/service/recipe-service.service';
import {Recipe} from 'src/app/shared/model/recipe';
import {trigger} from '@angular/animations';
import {fadeIn} from '../../shared/animation/fadeIn';
import {AppSetting} from '../../appsetting';
import {ChatService} from 'src/app/shared/service/chat.service';

@Component({
  selector: 'app-myrecipe',
  templateUrl: './myrecipe.component.html',
  styleUrls: ['./myrecipe.component.css'],
  animations: [
    trigger('fadeIn', fadeIn())
  ]
})
export class MyrecipeComponent implements OnInit {
  id: string = '1';
  imageProp: string = 'profile';
  url: string = '';
  value: number = 0;
  options: Options = {
    floor: 0,
    ceil: 1000,
    showTicksValues: false,
    disabled: true,
    hideLimitLabels: true,
  };
  acceptRecipe: Recipe[] = [];
  waitingRecipe: Recipe[] = [];
  decilineRecipe: Recipe[] = [];
  user: User;
  loadPage: boolean = false;
  p: number;

  constructor(
    private _loginService: LoginServiceService,
    private cookie: CookieService,
    private recipeService: RecipeService,
    private chatService: ChatService
  ) {
  }

  ngOnInit() {
    this.getUserInfo();
    this.chatService.scrollToTop();
  }

  getUserInfo() {
    let email = localStorage.getItem('email');
    if (email !== '') {
      this._loginService.testEmail(email).subscribe(data => {
        let user = data.body['user'];
        if (user !== undefined) {
          this.recipeService.getAllRecipes().subscribe(recipes => {
            recipes.forEach(recipe => {
              if (recipe.user._id === user._id) {
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
                recipe.imageUrl = AppSetting.BASE_IMAGE_URL + recipe.imageUrl;
                if (recipe.status === 1) {
                  this.acceptRecipe.push(recipe);
                } else if (recipe.status === 0) {
                  this.waitingRecipe.push(recipe);
                } else {
                  this.decilineRecipe.push(recipe);
                }
              }
            });

          });
          this.user = user;
          this.url = AppSetting.BASE_IMAGE_URL + user.imageUrl;
          this.id = user._id;
          this.loadPage = true;
          if (user.totalPoint > 600) {
            this.value = user.totalPoint;
            user.level = 'Mastee';
          } else if (user.totalPoint > 400) {
            this.value = user.totalPoint;
            user.level = 'Cheffe';
          } else if (user.totalPoint > 250) {
            this.value = user.totalPoint;
            user.level = 'Cookee';
          } else if (user.totalPoint > 100) {
            this.value = user.totalPoint;
            user.level = 'Tastee';
          } else {
            this.value = user.totalPoint;
            user.level = 'Newbee';
          }
        }
      });
    }
  }
}
