import { Component, OnInit } from '@angular/core';
import { Recipe } from 'src/app/shared/model/recipe';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { RecipeService } from 'src/app/shared/service/recipe-service.service';
import { UserService } from 'src/app/shared/service/user.service.';
import { Comment } from 'src/app/shared/model/comment';
import { CookStep } from '../../shared/model/cookStep';

@Component({
  selector: 'app-recipe-check',
  templateUrl: './recipe-check.component.html',
  styleUrls: ['./recipe-check.component.css']
})
export class RecipeCheckComponent implements OnInit {
  recipe: Recipe;
  recipeView: Recipe;
  cookSteps: CookStep[] = [];
  cookStepsView: CookStep[] = [];
  multiplyElement: number = 1;
  oldMultiplyElement: number;
  like: boolean = false;
  done: boolean = false;
  showImageStep: boolean = false;
  prepared: number;
  totalCookingTime: number;
  recipes: Recipe[] = [];
  errorMessage: string = '';
  message: string = '';
  recipeComment: Comment[] = [];
  lstComment: Comment[];
  viewFull = true;
  messageModal = false;
  accept = false;

  constructor(
    private route: ActivatedRoute,
    private _router: Router,
    private cookie: CookieService,
    private recipeService: RecipeService,
    private userService: UserService) {
  }

  id: string;

  ngOnInit() {
    this.getRecipeDetail();

  }

  getRecipeDetail() {
    this.id = this.route.snapshot.params.id;
    this.recipeService.getRecipeDetail(this.id).subscribe(data => {

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
          if (cookStep.check === 'true') {
            cookStep.check = 'là bước chuẩn bị';
          } else {
            cookStep.check = '';
          }
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
      this.getRecipes();
    });
  }

  getRecipes() {
    this.recipeService.getRecipes().subscribe(recipeArray => {
      let arr: Recipe[] = [];
      for (let recip of recipeArray) {
        for (let cookCheck of this.recipe.cookWay) {
          let cookWayArr = recip.cookWay;
          for (let cokkway of cookWayArr) {
            if (cookCheck.cookWayCode === cokkway.cookWayCode && recip._id !== this.recipe._id) {
              arr.push(recip);
            }
          }
        }
      }
      this.recipes = arr.filter(function (item, pos) {
        return arr.indexOf(item) == pos;
      });
      this.getComent();
      console.log(this.recipes);
    });
  }

  showRecipe(recipe: Recipe) {
    document.getElementById('mySidebar').style.width = '0';
    document.getElementById('main').style.marginLeft = '0';
    document.getElementById('menu-open').style.opacity = '1';
    console.log(recipe);
    if (recipe !== undefined && recipe.ingredients.length > 0) {
      for (let ingredient of recipe.ingredients) {
        ingredient.quantitative = parseInt(ingredient.quantitative) * this.multiplyElement;
        this.oldMultiplyElement = this.multiplyElement;
      }
    }
    if (recipe !== undefined && recipe.cockStep.length > 0) {
      for (let ingredient of recipe.ingredients) {
        ingredient.quantitative = parseInt(ingredient.quantitative) * this.multiplyElement;
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
    this.recipeView = recipe;
  }

  getComent() {
    this.recipeService.getComments().subscribe(data => {
      if (data !== undefined) {
        this.lstComment = data['comments'];
        console.log(this.lstComment);
        for (const comment of this.lstComment) {
          console.log(comment.recipe.recipeName);
          if (comment.recipe.recipeName === this.recipe.recipeName) {
            if (comment.type === 1) {
              comment.type = 'Đã thực hiện';
            } else {
              comment.type = '';
            }
            console.log(comment);
            if (comment.imageUrl !== undefined && comment.imageUrl.length > 0) {
              const imageArr = comment.imageUrl.split(',');
              comment.imageUrl = imageArr;
              console.log(imageArr);
            }
            this.recipeComment.push(comment);
          }
        }
      }
    });
  }


  countIngredient(multiplyElement: any) {
    this.multiplyElement = multiplyElement;
    if (this.recipe !== undefined && this.recipe.ingredients.length > 0) {
      for (let ingredient of this.recipe.ingredients) {
        ingredient.quantitative = parseInt(ingredient.quantitative) / this.oldMultiplyElement * this.multiplyElement;
      }

    }
    if (this.recipeView !== undefined && this.recipeView.ingredients.length > 0) {
      for (let ingredient of this.recipeView.ingredients) {
        ingredient.quantitative = parseInt(ingredient.quantitative) / this.oldMultiplyElement * this.multiplyElement;
      }
      // this.oldMultiplyElement = this.multiplyElement;
    }
    this.oldMultiplyElement = this.multiplyElement;
  }

  openModal(approve: any) {
    const radio: HTMLElement = document.getElementById('modal-button');
    radio.click();
    this.errorMessage = '';
    this.message = '';
    this.messageModal = false;
    if (approve === true) {
      this.message = 'Bạn muốn duyệt công thức này?';
      this.accept = true;
    } else {
      this.accept = false;
      this.message = 'Bạn muốn từ chối công thức này?';
    }
  }

  acceptRecipe(event: any) {
    if (this.recipe.status === 1) {
      this.errorMessage = 'Công thức này đã được duyệt';
      this.message = '';
      this.messageModal = true;
      return;
    }
    let token = this.cookie.get('email');
    let recipeObject = {
      recipe: this.recipe,
      email: token
    };
    this.recipeService.acceptRecipe(recipeObject).subscribe(data => {
      const result = data.body;
      console.log(result);
      if (result['status'] === 200) {
        this.message = result['message'];
        this.messageModal = true;
        setTimeout(() => {
          window.location.reload();
        }, 3000);
        this.recipe.status = 1;
      } else if (result['status'] !== 200) {
        this.errorMessage = result['message'];
      }
    });
  }

  declineRecipe(event: any) {
    if (this.recipe.status === -1) {
      this.errorMessage = 'Công thức này đã bị từ chối';
      this.message = '';
      this.messageModal = true;
      return;
    }

    let token = this.cookie.get('email');
    let recipeObject = {
      recipe: this.recipe,
      email: token
    };
    this.recipeService.declineRecipe(recipeObject).subscribe(data => {
      const result = data.body;
      console.log(result);
      if (result['status'] === 200) {
        this.message = result['message'];
        this.messageModal = true;
        this.recipe.status = -1;
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else if (result['status'] !== 200) {
        this.errorMessage = result['message'];
      }
    });
  }


  video(link: any) {
    var url
    if (link.includes('https:')) {
      url = link;
    } else {
      url = 'https://www.youtube.com/watch?v=' + link;
    }
    window.open(url, 'MsgWindow', 'width=600,height=400');
  }

  fullImage() {
    this.viewFull = true;
    var arrayNoimag = Array.from(document.getElementsByClassName('noImage') as HTMLCollectionOf<HTMLElement>);
    arrayNoimag.forEach((element) => {
      element.style.height = '300px';
      element.style.minHeight = '400px';
    });
    var arrayNoimag = Array.from(document.getElementsByClassName('bigContent') as HTMLCollectionOf<HTMLElement>);
    arrayNoimag.forEach((element) => {
      element.style.height = '300px';
      element.style.minHeight = '400px';
    });
    var arrayNoimage = Array.from(document.getElementsByClassName('noImage1') as HTMLCollectionOf<HTMLElement>);
    arrayNoimag.forEach((element) => {
      element.style.height = '300px';
      element.style.minHeight = '400px';
    });
    var arrayNoimag = Array.from(document.getElementsByClassName('bigC') as HTMLCollectionOf<HTMLElement>);
    arrayNoimag.forEach((element) => {
      element.style.height = '300px';
      element.style.minHeight = '400px';
    });
    this.showImageStep = false;
  }

  icon = 'highlight_off';

  public changeIcon(event: any, index: number) {
    const id = 'icon' + index;
    const radio: HTMLElement = document.getElementById(id);

    if (radio.style.color === 'lightgreen') {
      radio.style.color = 'gray';
    } else {
      radio.style.color = 'lightgreen';
    }

  }

  public changeIconTab(event: any, index: number) {
    const id = 'iconTab' + index;
    const radio: HTMLElement = document.getElementById(id);

    if (radio.style.color === 'lightgreen') {
      radio.style.color = 'gray';
    } else {
      radio.style.color = 'lightgreen';
    }

  }

  noImage() {
    this.viewFull = false;
    var arrayNoimag = Array.from(document.getElementsByClassName('noImage') as HTMLCollectionOf<HTMLElement>);
    arrayNoimag.forEach((element) => {
      element.style.height = '150px';
      element.style.minHeight = '150px';
    });
    var arrayNoimage = Array.from(document.getElementsByClassName('noImage1') as HTMLCollectionOf<HTMLElement>);
    arrayNoimag.forEach((element) => {
      element.style.height = '100px';
      element.style.minHeight = '100px';
    });
    var arrayNoimag = Array.from(document.getElementsByClassName('bigContent') as HTMLCollectionOf<HTMLElement>);
    arrayNoimag.forEach((element) => {
      element.style.height = '150px';
      element.style.minHeight = '150px';
    });
    var arrayNoimag = Array.from(document.getElementsByClassName('bigC') as HTMLCollectionOf<HTMLElement>);
    arrayNoimag.forEach((element) => {
      element.style.height = '150px';
      element.style.minHeight = '150px';
    });
    this.showImageStep = true;
  }


}

