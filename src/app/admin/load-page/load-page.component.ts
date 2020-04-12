import {Component, OnInit} from '@angular/core';
import {User} from '../../shared/model/user';
import {UserService} from '../../shared/service/user.service.';
import {Summary} from '../../shared/model/summary';
import {Recipe} from '../../shared/model/recipe';
import {RecipeService} from '../../shared/service/recipe-service.service';

@Component({
  selector: 'app-load-page',
  templateUrl: './load-page.component.html',
  styleUrls: ['./load-page.component.css']
})
export class LoadPageComponent implements OnInit {
  numbers: number[] = [];
  imageUrl: string = 'jbiajl3qqdzshdw0z749';
  topUsers: User[] = [];
  modlst: User[] = [];
  summary: Summary;
  recipes: Recipe[] = [];
  constructor(
    private userService: UserService,
    private recipeservice: RecipeService) {
    for (let index = 0; index < 10000; index++) {
      this.numbers.push(index);
    }
  }

  ngOnInit() {
    this.getMod();
    this.getTopUser();
    this.getSummary();
    this.getNewRecipes();
  }

  getTopUser() {
    this.userService.getTopUsers().subscribe(users => {
      this.topUsers = users;
      for (const user of this.topUsers) {
        if (user.imageUrl === undefined) {
          user.imageUrl = this.imageUrl;
        }
      }
    });
  }

  getMod() {
    this.userService.getUsers().subscribe(users => {
      const lstTemp = users;
      lstTemp.sort((a, b) => {
        if (a.role > b.role) {
          return -1;
        } else if (a.role < b.role) {
          return 1;
        } else {
          return 0;
        }
      });
      for (const user of lstTemp) {
        if (user.role > 0) {
          if (user.imageUrl === undefined) {
            user.imageUrl = this.imageUrl;
          }
          if (user.role === 1) {
            user.role = 'Quản trị viên';
          } else if (user.role > 1) {
            user.role = 'Admin';
          }
          this.modlst.push(user);
        }
      }
      console.log(this.modlst);
    });
  }

  getSummary() {
    this.userService.getSummary(1).subscribe(data => {
      this.summary = data.body['summary'];
      console.log(this.summary);
    });
  }
  getNewRecipes() {
    this.recipeservice.getNewRecipes().subscribe(recipes => {
      this.recipes = recipes;
      for (const recipe of this.recipes) {
        if (recipe.imageUrl === undefined) {
          recipe.imageUrl = 'jbiajl3qqdzshdw0z749';
        }
        if (recipe.hardLevel !== undefined) {
          if (recipe.hardLevel === '') {
            recipe.hardLevel = 'Không xác định';
          } else if (recipe.hardLevel === '1') {
            recipe.hardLevel = 'Dễ';
          } else if (recipe.hardLevel === '2') {
            recipe.hardLevel = 'Trung bình';
          } else if (recipe.hardLevel === '3') {
            recipe.hardLevel = 'Khó';
          } else if (recipe.hardLevel === '4') {
            recipe.hardLevel = 'Rất khó';
          }
        }
        console.log(recipe.status)
        if (recipe.status === 1) {
          recipe.status = 'Đã duyệt'
        } else if (recipe.status === 0) {
          recipe.status = 'Chưa duyệt'
        } else {
          recipe.status = 'Từ chối'
        }
        if (recipe.user == null) {
          recipe.user.name = 'Đợi duyệt'
        }
      }
      console.log(this.recipes);
    });
  }
}
