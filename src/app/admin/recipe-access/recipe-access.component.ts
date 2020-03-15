import { Component, OnInit, AfterViewInit } from '@angular/core';
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
      itemsPerPage: 10,
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
          recipe.status = 'Đã duyệt'
        } else {
          recipe.status = 'Chưa duyệt'
        }
      }
      console.log(this.recipes);
    });
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }

    this.order = value;
  }
}
