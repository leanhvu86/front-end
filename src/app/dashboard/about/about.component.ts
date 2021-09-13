import {Component, OnInit} from '@angular/core';
import {UserService} from 'src/app/shared/service/user.service.';
import {User} from 'src/app/shared/model/user';
import {RecipeService} from 'src/app/shared/service/recipe-service.service';
import {GalleryService} from 'src/app/shared/service/gallery.service';
import {Recipe} from 'src/app/shared/model/recipe';
import {trigger} from '@angular/animations';
import {fadeIn} from '../../shared/animation/fadeIn';
import {AppSetting} from '../../appsetting';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  animations: [
    trigger('fadeIn', fadeIn())
  ]
})
export class AboutComponent implements OnInit {

  allUser: User[] = [];
  topUsers: User[] = [];
  imageUrl: string = 'avatar.png';
  recipes: Recipe[] = [];
  p: number;
  loadingSuccess = false;

  constructor(
    private userService: UserService,
    private recipeService: RecipeService,
    private galleryService: GalleryService
  ) {
  }

  ngOnInit() {
    this.getTopUser();
    this.getUsers();
  }

  getUsers() {
    this.recipeService.getRecipes().subscribe(recipes => {
      if (recipes !== undefined) {
        this.galleryService.getGalleryies().subscribe(gallerys => {
          for (let i = 0; i < recipes.length; i++) {
            let recipe = recipes[i];
            for (let userIndex = 0; userIndex < this.allUser.length; userIndex++) {
              let user = this.allUser[userIndex];

              if (user.imageUrl === undefined) {
                user.imageUrl = AppSetting.BASE_IMAGE_URL + this.imageUrl;
              }
              if (user._id === recipe.user._id) {
                user.role++;
              }
            }
          }
          for (let i = 0; i < gallerys.length; i++) {
            let gallery = gallerys[i];
            for (let userIndex = 0; userIndex < this.allUser.length; userIndex++) {
              let user = this.allUser[userIndex];
              if (user._id === gallery.user._id) {
                user.warningReport++;
              }
            }
          }
        });
      }
    });
  }

  getTopUser() {
    this.userService.getTopUsers().subscribe(users => {
      this.recipeService.getRecipes().subscribe(recipes => {

        if (recipes !== undefined) {
          this.galleryService.getGalleryies().subscribe(gallerys => {
            this.topUsers = users;
            for (let user of this.topUsers) {
              user.role = 0;
              user.warningReport = 0;
              if (user.totalPoint > 600) {
                user.level = 'Mastee';
              } else if (user.totalPoint > 400) {
                user.level = 'Cheffe';
              } else if (user.totalPoint > 250) {
                user.level = 'Cookee';
              } else if (user.totalPoint > 100) {
                user.level = 'Tastee';
              } else {
                user.level = 'Newbee';
              }
              user.imageUrl = AppSetting.BASE_IMAGE_URL + user.imageUrl;

            }
            for (let i = 0; i < recipes.length; i++) {
              let recipe = recipes[i];
              // tslint:disable-next-line:prefer-for-of
              for (let userIndex = 0; userIndex < this.topUsers.length; userIndex++) {
                let user = this.topUsers[userIndex];

                if (user.imageUrl === undefined) {
                  user.imageUrl = this.imageUrl;
                }
                user.imageUrl = AppSetting.BASE_IMAGE_URL + user.imageUrl;
                if (user._id === recipe.user._id) {
                  user.role++;
                }
              }
            }
            for (let i = 0; i < gallerys.length; i++) {
              let gallery = gallerys[i];
              for (let userIndex = 0; userIndex < this.topUsers.length; userIndex++) {
                let user = this.topUsers[userIndex];
                if (user._id === gallery.user._id) {
                  user.warningReport++;
                }
              }
            }
            this.loadingSuccess = true;
            // tslint:disable-next-line:no-shadowed-variable
            this.userService.getNewUsers().subscribe(users => {
              users.forEach(user => {
                if (user.status >= 0) {
                  user.role = 0;
                  user.warningReport = 0;
                }
                user.imageUrl = AppSetting.BASE_IMAGE_URL + user.imageUrl;
                this.allUser.push(user);
              });
              for (let i = 0; i < recipes.length; i++) {
                let recipe = recipes[i];
                for (let userIndex = 0; userIndex < this.allUser.length; userIndex++) {
                  let user = this.allUser[userIndex];

                  if (user.imageUrl === undefined) {
                    user.imageUrl = this.imageUrl;
                  }
                  user.imageUrl = AppSetting.BASE_IMAGE_URL + user.imageUrl;
                  if (user._id === recipe.user._id) {
                    user.role++;
                  }
                }
              }
              for (let i = 0; i < gallerys.length; i++) {
                let gallery = gallerys[i];
                for (let userIndex = 0; userIndex < this.allUser.length; userIndex++) {
                  let user = this.allUser[userIndex];
                  if (user._id === gallery.user._id) {
                    user.warningReport++;
                  }
                }
              }
            });
          });
        }
      });
    });
  }
}
