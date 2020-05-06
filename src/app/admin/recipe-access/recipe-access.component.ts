import { AfterViewInit, Component } from '@angular/core';
import { OrderPipe } from 'ngx-order-pipe';
import { RecipeService } from 'src/app/shared/service/recipe-service.service';
import { Recipe } from 'src/app/shared/model/recipe';

@Component({
  selector: 'app-recipe-access',
  templateUrl: './recipe-access.component.html',
  styleUrls: ['./recipe-access.component.css']
})
export class RecipeAccessComponent implements AfterViewInit {

  recipes: Recipe[] = [];
  config: any;
  searchText;
  collection = { count: 60, data: [] };
  key: any;
  pageSize = 10;
  constructor(private recipeservice: RecipeService, private orderPipe: OrderPipe) {
    this.collection = orderPipe.transform(this.collection, 'info.name');
    console.log(this.collection);
    for (var i = 0; i < this.collection.count; i++) {
      this.collection.data.push(
        {
          id: i + 1,
          value: "items number " + (i + 1)
        }
      );
    }

    this.config = {
      itemsPerPage: this.pageSize,
      currentPage: 1,
      totalItems: this.recipes.length
    };
  }
  ngAfterViewInit(): void {
    this.getRecipes()
  }
  order: string = 'info.name';
  reverse: boolean = false;
  pageChanged(event) {
    this.config.currentPage = event;
  }
  getRecipes() {
    this.recipeservice.getAllRecipes().subscribe(recipes => {
      this.recipes = recipes;
      for (let recipe of this.recipes) {
        if (recipe.imageUrl === undefined) {
          recipe.imageUrl = 'jbiajl3qqdzshdw0z749'
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
        if (recipe.status === 1) {
          recipe.status = 'Đã duyệt';
          recipe.ord = 2;
        } else if (recipe.status === 0) {
          recipe.status = 'Chưa duyệt';
          recipe.ord = 3;
        } else {
          recipe.status = 'Từ chối';
          recipe.ord = 1;
        }
        if (recipe.user == null) {
          recipe.user.name = 'Đợi duyệt';
        }
      }
      this.recipes.sort((a, b) => {
        if (a.ord > b.ord) {
          return -1;
        } else if (a.ord < b.ord) {
          return 1;
        } else {
          return 0;
        }
      });
      for (let i = 0; i < this.recipes.length; i++) {
        let recipe = this.recipes[i];
        recipe.seq = i + 1;
      }
      console.log(this.recipes);
    });
  }
  keyUp() {
    console.log(this.pageSize)
    if (this.searchText.length > 2) {
      this.pageSize = this.recipes.length;
      this.pageChanged(1);
    } else {
      this.pageSize = 10;
    }
  }
  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }

    this.order = value;
  }
}
