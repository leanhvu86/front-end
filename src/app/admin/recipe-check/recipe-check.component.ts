import { Component, OnInit } from '@angular/core';
import { Recipe } from 'src/app/shared/model/recipe';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { RecipeService } from 'src/app/shared/service/recipe-service.service';
import { UserService } from 'src/app/shared/service/user.service.';

@Component({
  selector: 'app-recipe-check',
  templateUrl: './recipe-check.component.html',
  styleUrls: ['./recipe-check.component.css']
})
export class RecipeCheckComponent implements OnInit {
  recipe: Recipe;
  recipeView: Recipe;
  cookSteps: [] = [];
  cookStepsView: [] = [];
  multiplyElement: number = 4;
  oldMultiplyElement: number;
  like: boolean = false;
  done: boolean = false;
  showImageStep: boolean = false;
  prepared: number;
  totalCookingTime: number;
  recipes: Recipe[] = [];
  errorMessage: string;
  constructor(
    private route: ActivatedRoute,
    private _router: Router,
    private cookie: CookieService,
    private recipeService: RecipeService,
    private userService: UserService) { }
  id: string;
  ngOnInit() {
    this.getRecipeDetail();

  }
  getRecipeDetail() {
    this.id = this.route.snapshot.params.id;
    this.recipeService.getRecipeDetail(this.id).subscribe(data => {

      this.recipe
      let recipeTem = data['recipe'];
      this.recipe = recipeTem;
      if (this.recipe !== undefined && this.recipe.ingredients.length > 0) {
        for (let ingredient of this.recipe.ingredients) {
          let quantity = parseInt(ingredient.quantitative) * this.multiplyElement;
          ingredient.quantitative = quantity;
          this.oldMultiplyElement = this.multiplyElement;
        }
      }
      if (this.recipe !== undefined && this.recipe.cockStep.length > 0) {
        for (let ingredient of this.recipe.ingredients) {
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
      }
      this.getRecipes()
    });
  }
  getRecipes() {
    this.recipeService.getRecipes().subscribe(recipeArray => {
      let arr: Recipe[] = [];
      for (let recip of recipeArray) {
        for (let cookCheck of this.recipe.cookWay) {
          let cookWayArr = recip.cookWay;
          for (let cokkway of cookWayArr) {
            if (cookCheck.cookWayCode === cokkway.cookWayCode) {
              arr.push(recip);
            }
          }
        }
      }
      this.recipes = arr.filter(function (item, pos) {
        return arr.indexOf(item) == pos;
      });

      console.log(this.recipes);
    });
  }
  showRecipe(recipe: Recipe) {
    console.log(recipe);
    if (recipe !== undefined && recipe.ingredients.length > 0) {
      for (let ingredient of recipe.ingredients) {
        let quantity = parseInt(ingredient.quantitative) * this.multiplyElement;
        ingredient.quantitative = quantity;
        this.oldMultiplyElement = this.multiplyElement;
      }
    }
    if (recipe !== undefined && recipe.cockStep.length > 0) {
      for (let ingredient of recipe.ingredients) {
        let quantity = parseInt(ingredient.quantitative) * this.multiplyElement;
        ingredient.quantitative = quantity;
        this.oldMultiplyElement = this.multiplyElement;
      }
      for (let cookStep of recipe.cockStep) {
        let arrayTemp = cookStep.image;
        if (arrayTemp.indexOf(',') >= 0) {
          cookStep.image = arrayTemp.split(',');
          cookStep.check = true;
        }

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
      this.cookStepsView = recipe.cockStep;
    }
    this.recipeView = recipe
  }
  countIngredient(multiplyElement: any) {
    if (this.recipe !== undefined && this.recipe.ingredients.length > 0) {
      for (let ingredient of this.recipe.ingredients) {
        let quantity = parseInt(ingredient.quantitative) / this.oldMultiplyElement * this.multiplyElement;
        ingredient.quantitative = quantity;
      }
      this.oldMultiplyElement = this.multiplyElement;
    }
  }
  acceptRecipe() {
    this.recipeService.acceptRecipe(this.recipe).subscribe(data => {
      const result = data.body
      console.log(result['status'] + "fdsfsfd")
      if (result['status'] === 200) {
        alert('Xác nhận công thức thành công')
        this.errorMessage = result['message'];
        setTimeout(() => {
          this._router.navigate(['/recipeAccess']);
        }, 2000);
      } else if (result['status'] !== 200) {
        this.errorMessage = result['message'];
      }
    })
  }
  declineRecipe() {
    this.recipeService.declineRecipe(this.recipe).subscribe(data => {
      const result = data.body
      console.log(result['status'] + "fdsfsfd")
      if (result['status'] === 200) {
        alert('Từ chối công thức thành công')
        this.errorMessage = result['message'];
        setTimeout(() => {
          this._router.navigate(['/recipeAccess']);
        }, 2000);
      } else if (result['status'] !== 200) {
        this.errorMessage = result['message'];
      }
    })
  }
  video(link: any) {
    var url = 'https://www.youtube.com/watch?v=' + link;
    window.open(url, "MsgWindow", "width=600,height=400");
  }
  fullImage() {
    var arrayNoimag = Array.from(document.getElementsByClassName('noImage') as HTMLCollectionOf<HTMLElement>)
    arrayNoimag.forEach((element) => {
      element.style.height = '300px';
      element.style.minHeight = '400px'
    })
    var arrayNoimag = Array.from(document.getElementsByClassName('bigContent') as HTMLCollectionOf<HTMLElement>)
    arrayNoimag.forEach((element) => {
      element.style.height = '300px';
      element.style.minHeight = '400px'
    })
    this.showImageStep = false;
  }
  icon = 'highlight_off';

  public changeIcon(event: any, index: number) {
    const id = 'icon' + index;
    const radio: HTMLElement = document.getElementById(id);

    if (radio.style.color === 'lightgreen') {
      radio.style.color = 'gray'
    } else {
      radio.style.color = 'lightgreen'
    }

  }
  public changeIconTab(event: any, index: number) {
    const id = 'iconTab' + index;
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
      element.style.height = '150px';
      element.style.minHeight = '150px'
    })
    var arrayNoimag = Array.from(document.getElementsByClassName('bigContent') as HTMLCollectionOf<HTMLElement>)
    arrayNoimag.forEach((element) => {
      element.style.height = '150px';
      element.style.minHeight = '150px'
    })
    this.showImageStep = true;
  }


}

