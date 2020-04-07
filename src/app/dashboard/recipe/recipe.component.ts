import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../.././shared/service/recipe-service.service'
import { from } from 'rxjs';
import { Recipe } from '../../shared/model/recipe';
@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {
  recipes: Recipe[];

  constructor(
    private service: RecipeService
  ) { }

  ngOnInit() {
    this.getRecipe();
  }
  video(link: any) {
    console.log(link)
    var url = 'https://www.youtube.com/watch?v=' + link;
    window.open(url, "MsgWindow", "width=600,height=400");
  }
  getRecipe = () => {
    this.service.getRecipes().subscribe(data => {
      this.recipes = data
      this.recipes.forEach(recipe => {
        recipe.like = false
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
        if (recipe.user.imageUrl === undefined) {
          recipe.user.imageUrl = 'jbiajl3qqdzshdw0z749'
        }
      })
    })
  }
}
