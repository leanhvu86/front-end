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
  cookSteps: [] = [];
  multiplyElement: number = 4;
  oldMultiplyElement: number;
  like: boolean = false;
  done: boolean = false;
  showImageStep: boolean = false;
  prepared: number;
  totalCookingTime: number;
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

      console.log(data['recipe'])
      this.recipe
      let recipeTem = data['recipe'];
      this.recipe = recipeTem;
      if (this.recipe !== undefined && this.recipe.ingredients.length > 0) {
        for (let ingredient of this.recipe.ingredients) {
          console.log(ingredient)
          let quantity = parseInt(ingredient.quantitative) * this.multiplyElement;
          ingredient.quantitative = quantity;
          this.oldMultiplyElement = this.multiplyElement;
        }
      }
      if (this.recipe !== undefined && this.recipe.cockStep.length > 0) {
        for (let ingredient of this.recipe.ingredients) {
          console.log(ingredient)
          let quantity = parseInt(ingredient.quantitative) * this.multiplyElement;
          ingredient.quantitative = quantity;
          this.oldMultiplyElement = this.multiplyElement;
        }
        for (let cookStep of this.recipe.cockStep) {
          let arrayTemp = cookStep.image;
          cookStep.image = arrayTemp.split(',');
          cookStep.check = true;
        }
        if (this.recipe.hardLevel !== undefined) {
          if (this.recipe.hardLevel === '') {
            this.recipe.hardLevel = 'Không xác định';
          } else if (this.recipe.hardLevel === '1') {
            this.recipe.hardLevel = 'Dễ';
          } else if (this.recipe.hardLevel === '2') {
            this.recipe.hardLevel = 'Trung bình';
          } else if (this.recipe.hardLevel === '3') {
            this.recipe.hardLevel = 'Khó';
          } else if (this.recipe.hardLevel === '4') {
            this.recipe.hardLevel = 'Rất khó';
          }
        }
        this.cookSteps = this.recipe.cockStep;
        console.log(this.cookSteps)
      }

    });
  }
  countIngredient(multiplyElement: any) {
    console.log(this.multiplyElement)
    if (this.recipe !== undefined && this.recipe.ingredients.length > 0) {
      for (let ingredient of this.recipe.ingredients) {
        console.log(ingredient)
        let quantity = parseInt(ingredient.quantitative) / this.oldMultiplyElement * this.multiplyElement;
        ingredient.quantitative = quantity;
      }
      this.oldMultiplyElement = this.multiplyElement;
    }
  }
  fullImage() {
    var arrayNoimag = Array.from(document.getElementsByClassName('noImage') as HTMLCollectionOf<HTMLElement>)
    arrayNoimag.forEach((element) => {
      console.log(element)
      element.style.height = '300px';
      element.style.minHeight = '400px'
    })
    var arrayNoimag = Array.from(document.getElementsByClassName('bigContent') as HTMLCollectionOf<HTMLElement>)
    arrayNoimag.forEach((element) => {
      console.log(element)
      element.style.height = '300px';
      element.style.minHeight = '400px'
    })
    this.showImageStep = false;
    console.log(this.showImageStep)
  }
  icon = 'highlight_off';

  public changeIcon(event: any, index: number) {
    console.log('click' + event)
    console.log('click' + index)
    const id = 'icon' + index;
    const radio: HTMLElement = document.getElementById(id);

    if (radio.style.color === 'lightgreen') {
      radio.style.color = 'gray'
    } else {
      radio.style.color = 'lightgreen'
    }

  }
  noImage() {
    var arrayNoimag = Array.from(document.getElementsByClassName('noImage') as HTMLCollectionOf<HTMLElement>)
    arrayNoimag.forEach((element) => {
      console.log(element)
      element.style.height = '150px';
      element.style.minHeight = '150px'
    })
    var arrayNoimag = Array.from(document.getElementsByClassName('bigContent') as HTMLCollectionOf<HTMLElement>)
    arrayNoimag.forEach((element) => {
      console.log(element)
      element.style.height = '150px';
      element.style.minHeight = '150px'
    })
    this.showImageStep = true;
    console.log(this.showImageStep)
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
  addDoneRecipe(recipe: any) {
    console.log(recipe);
    this.done = true;
    let user = this.cookie.get('email');
    console.log(recipe)
    let doneObject = new Object({
      user: user,
      recipe: recipe,
      type: 1,
      content: '',
      imageUrl: ''
    })
    console.log(doneObject)
    this.recipeService.addComment(doneObject).subscribe((data) => {
      if (data !== undefined) {
        console.log(data)
        this.recipe = data.body['recipe']
        console.log('success')
        // let userObject = new Object({
        //   email: user.email
        // })
        // this.userService.likeAddPoint(userObject).subscribe((data) => {
        //   if (data.body['status'] === 200) {
        //     console.log('success')

        //   }
        // });
      }
    });

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

