import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RecipeService } from 'src/app/shared/service/recipe-service.service';
import { Recipe } from 'src/app/shared/model/recipe';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/shared/service/user.service.';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  multiplyElement: number = 4;
  like: boolean = false;
  constructor(private route: ActivatedRoute,
    private cookie: CookieService, private recipeService: RecipeService, private userService: UserService) { }
  id: string;
  ngOnInit() {
    this.getRecipeDetail();
  }
  getRecipeDetail() {
    console.log('recipe');
    this.id = this.route.snapshot.params.id;
    console.log(this.id);
    this.recipeService.getRecipeDetail(this.id).subscribe(data => {

      this.recipe = data['recipe'];
      this.recipe.like = false;
      console.log(this.recipe);
    });
  }
  likeRecipe(recipe: any) {
    console.log(recipe);
    this.like = true;

    console.log(recipe.user.email)
    let user = recipe.user;
    let interestObject = new Object({
      user: user,
      objectId: recipe,
      objectType: '2'
    })
    console.log(interestObject)
    this.recipeService.likeRecipe(interestObject).subscribe((data) => {
      if (data !== undefined) {
        console.log(data)
        this.recipe = data.body['recipe']
        console.log('success')
        let userObject = new Object({
          email: user.email
        })
        this.userService.likeAddPoint(userObject).subscribe((data) => {
          if (data.body['status'] === 200) {
            console.log('success')

          }
        });
      }
    });

  }
  addComment(even: any) {
    const radio: HTMLElement = document.getElementById('nav-profile-tab');
    radio.click();
  }
  dislikeRecipe(recipe: any) {
    console.log(recipe);
    this.like = false;
    console.log(recipe.user.email)
    let user = recipe.user;
    let interestObject = new Object({
      user: user,
      objectId: recipe,
      objectType: '2'
    })
    console.log(recipe.user.email)
    console.log(interestObject)
    this.recipeService.dislikeRecipe(interestObject).subscribe((data) => {
      if (data !== undefined) {
        console.log(data)
        this.recipe = data.body['recipe']
        let userObject = new Object({
          email: user.email
        })
        this.userService.dislikeremovePoint(userObject).subscribe((data) => {
          if (data.body['status'] === 200) {
            console.log('success')

          }
        });
      }
    })
  }
}

