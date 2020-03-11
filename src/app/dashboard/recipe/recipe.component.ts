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
  recipies: Recipe[];

  constructor(
    private service: RecipeService
  ) { }

  ngOnInit() {
    this.getRecipe();
  }
getRecipe=()=>{
  this.service.getRecipes().subscribe(data=>{
    return(this.recipies = data)
  })
}
}
