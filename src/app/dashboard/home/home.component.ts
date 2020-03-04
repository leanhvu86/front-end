import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Recipe } from 'src/app/shared/model/recipe';
import { RecipeService } from 'src/app/shared/service/recipe-service.service';
import { CookieService } from 'ngx-cookie-service';

declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class Home2Component implements OnInit {
  public recipes: Recipe[] = [];
  config: any;
  collection = { count: 60, data: [] };
  constructor(
    private translate: TranslateService,
    private cookie: CookieService,
    private recipeService: RecipeService) {
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
  }
  ngOnInit() {
    this.getRecipes();
  }
  pageChanged(event) {
    this.config.currentPage = event;
  }
  getRecipes() {
    this.recipeService.getRecipes().subscribe(recipes => {
      recipes.forEach(function (recipe) {
        recipe.like = false;
        console.log(recipe);
      });
      this.recipes = recipes;

      console.log(this.recipes);
    });
  }
  likeRecipe(recipe: any, index: any) {
    console.log(recipe);
    console.log(index);
    recipe.like = true;
    let email = this.cookie.get('email');
    let interestObject = new Object({
      user: email,
      objectId: recipe,
      objectType: '2'
    })
    let id = 'heart' + index;
    const radio: HTMLElement = document.getElementById(id);
    radio.style.color = 'red';
    radio.style.opacity = '0.8';
    console.log(radio)
    console.log(interestObject)
    this.recipeService.likeRecipe(interestObject).subscribe((data) => {
      if (data.body['status'] === 200) {
        console.log('success')
      }
    })
  }
  dislikeRecipe(recipe: any, index: any) {
    console.log(recipe);
    console.log(index);
    recipe.like = false;
    let email = this.cookie.get('email');
    let interestObject = new Object({
      user: email,
      objectId: recipe,
      objectType: '2'
    })
    let id = 'heart' + index;
    const radio: HTMLElement = document.getElementById(id);
    radio.style.color = 'white';
    radio.style.opacity = '0.4';
    console.log(radio)
    console.log(interestObject)
    this.recipeService.dislikeRecipe(interestObject).subscribe((data) => {
      if (data.body['status'] === 200) {

      }


    })
  }
}


