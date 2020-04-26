import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/service/user.service.';
import { User } from 'src/app/shared/model/user';
import { RecipeService } from 'src/app/shared/service/recipe-service.service';
import { GalleryService } from 'src/app/shared/service/gallery.service';
import { Recipe } from 'src/app/shared/model/recipe';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  allUser: User[] = [];
  topUsers: User[] = [];
  imageUrl: string = 'jbiajl3qqdzshdw0z749';
  recipes: Recipe[] = [];
  p: number;
  constructor(
    private userService: UserService,
    private recipeService: RecipeService,
    private galleryService: GalleryService
  ) {
    const radio: HTMLElement = document.getElementById('start-loading');
    radio.click();
  }

  ngOnInit() {
    this.getTopUser();
    this.getUsers();
  }

  getUsers() {
    this.userService.getNewUsers().subscribe(users => {
      users.forEach(user => {
        if (user.status >= 0) {
          user.role = 0;
          user.warningReport = 0

        }
      });
      this.allUser = users;
      this.recipeService.getRecipes().subscribe(recipes => {

        if (recipes !== undefined) {
          this.galleryService.getGalleryies().subscribe(gallerys => {
            for (let i = 0; i < recipes.length; i++) {
              let recipe = recipes[i];
              for (let userIndex = 0; userIndex < this.allUser.length; userIndex++) {
                let user = this.allUser[userIndex];

                if (user.imageUrl === undefined) {
                  user.imageUrl = this.imageUrl;
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
          })
        }
      })
    })
  }
  getTopUser() {
    this.userService.getTopUsers().subscribe(users => {
      this.recipeService.getRecipes().subscribe(recipes => {

        if (recipes !== undefined) {
          this.galleryService.getGalleryies().subscribe(gallerys => {
            this.topUsers = users;
            for (let user of this.topUsers) {
              user.role = 0;
              user.warningReport = 0
            }
            for (let i = 0; i < recipes.length; i++) {
              let recipe = recipes[i];
              for (let userIndex = 0; userIndex < this.topUsers.length; userIndex++) {
                let user = this.topUsers[userIndex];

                if (user.imageUrl === undefined) {
                  user.imageUrl = this.imageUrl;
                }
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
            const radio: HTMLElement = document.getElementById('complete-loading');
            radio.click();
          });
        }
      });
    });
  }
}
