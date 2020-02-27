import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Recipe } from 'src/app/shared/model/recipe';
import { RecipeService } from 'src/app/shared/service/recipe-service.service';

declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class Home2Component implements OnInit {
  public recipes: Recipe[] = [];
  constructor(private translate: TranslateService, private recipeService: RecipeService) {
    translate.setDefaultLang('vi');
  }

  ngOnInit() {
    this.getRecipes();
  }
  getRecipes() {
    this.recipeService.getRecipes().subscribe(recipes => {
      this.recipes = recipes;
      console.log(this.recipes);
    });
  }
}


