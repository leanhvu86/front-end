import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RecipeService } from 'src/app/shared/service/recipe-service.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  constructor(private route: ActivatedRoute, private recipeService: RecipeService) { }
  id$: string;
  id: string;
  ngOnInit() {
    this.getRecipeDetail();
  }
  getRecipeDetail() {
    console.log('recipe');
    this.id = this.route.snapshot.params.id;
    console.log(this.id);
    this.recipeService.getRecipeDetail(this.id).subscribe(data => {

      let recipe = data['recipe'];

      console.log(recipe);
    });
  }
}
