import {Component, OnInit} from '@angular/core';
import {RecipeService} from '../../shared/service/recipe-service.service';
import {Recipe} from '../../shared/model/recipe';
import {CookieService} from 'ngx-cookie-service';
import {UserService} from 'src/app/shared/service/user.service.';
import {ActivatedRoute} from '@angular/router';
import {FoodType} from 'src/app/shared/model/foodType';
import {CountryService} from 'src/app/shared/service/country.service';
import {Country} from 'src/app/shared/model/country';
import {CookWay} from 'src/app/shared/model/cookWay';
import {Interest} from 'src/app/shared/model/interest';
import {GalleryService} from 'src/app/shared/service/gallery.service';
import {Gallery} from 'src/app/shared/model/gallery';
import {trigger} from '@angular/animations';
import {fadeIn} from '../../shared/animation/fadeIn';
import {AppSetting} from '../../appsetting';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css'],
  animations: [
    trigger('fadeIn', fadeIn())
  ]
})
export class RecipeComponent implements OnInit {
  recipes: Recipe[];
  isAuthenicate: boolean = false;
  searchText: string = '';
  showFoodType: boolean = false;
  showCountrys: boolean = false;
  showCookWays: boolean = false;
  showIngredient: boolean = false;
  foodTypes: FoodType[] = [];
  countrys: Country[] = [];
  cookWays: CookWay[] = [];
  ingredients: CookWay[] = [];
  foodTypesFilter: FoodType[] = [];
  countrysFilter: Country[] = [];
  cookWaysFilter: CookWay[] = [];
  ingredientsFilter: CookWay[] = [];
  recipesFilter: Recipe[] = [];
  empty: Recipe[] = [];
  countRecipe: number = 0;
  stringFilter = '';
  errormessage = '';
  p: number;
  userObject = {
    email: '',
    password: ''
  };
  loadingSuccess = false;
  galleryObject = {
    _id: '',
    recipe: Recipe
  };
  message = '';
  addRecipe: any;
  loading = false;
  pageSize = 20;
  personalGallery: Gallery[] = [];
  public interests: Interest[] = [];
  baseImageUrl = AppSetting.BASE_IMAGE_URL;

  constructor(
    private service: RecipeService,
    private cookie: CookieService,
    private recipeService: RecipeService,
    private userService: UserService,
    private router: ActivatedRoute,
    private countryService: CountryService,
    private galleryService: GalleryService
  ) {
    if (localStorage.getItem('searchText') !== undefined && localStorage.getItem('searchText') !== 'undefined') {
      this.searchText = localStorage.getItem('searchText');
      localStorage.setItem('searchText', '');
    }
    this.isAuthenicate = localStorage.getItem('email') !== '';
  }

  ngOnInit() {
    this.getRecipe();
    this.getCookWays();
    this.getCountrys();
    this.getFoodTypes();

    this.getPersonalGallery();
  }

  getPersonalGallery() {
    let email = localStorage.getItem('email');
    if (email !== '') {
      this.galleryService.getGalleryies().subscribe(data => {
        if (data != null) {
          for (let gallery of data) {
            if (gallery.user.email === email) {
              if (gallery.recipe.length > 0) {
                gallery.image = gallery.recipe[0].imageUrl;
              } else {
                gallery.image = 'fvt7rkr59r9d7wk8ndbd';
              }
              this.personalGallery.push(gallery);
            }
          }
        }
      });
    }
  }

  video(link: any) {
    var url;
    if (link.includes('https:')) {
      url = link;
    } else {
      url = 'https://www.youtube.com/watch?v=' + link;
    }
    window.open(url, 'MsgWindow', 'width=600,height=400');
  }

  keyUp() {
    console.log(this.pageSize);
    if (this.searchText.length > 2) {
      this.pageSize = this.recipes.length;
      this.pageChanged(1);
    } else {
      this.pageSize = 20;
    }
  }

  pageChanged(event) {
    this.p = event;
  }

  loadFilter() {
    this.searchText = '';
    this.empty.length = 0;
    this.recipes = this.empty;
    let tempArr = this.empty;
    this.stringFilter = '';
    this.cookWaysFilter.forEach(cookWay => {
      if (this.stringFilter.indexOf(cookWay.cookWayCode) === -1) {
        this.stringFilter = this.stringFilter + ' #' + cookWay.cookWayCode;
      }
    });
    this.countrysFilter.forEach(country => {
      if (this.stringFilter.indexOf(country.countryCode) === -1) {
        this.stringFilter = this.stringFilter + ' #' + country.countryCode;
      }
    });
    this.foodTypesFilter.forEach(food => {
      if (this.stringFilter.indexOf(food.foodTypeCode) === -1) {
        this.stringFilter = this.stringFilter + ' #' + food.foodTypeCode;
      }
    });
    this.ingredientsFilter.forEach(cookWay => {
      if (this.stringFilter.indexOf(cookWay.cookWayCode) === -1) {
        this.stringFilter = this.stringFilter + ' #' + cookWay.cookWayCode;
      }
    });
    for (let recipe of this.recipesFilter) {
      let checkFoodType = false;
      let checkCountry = false;
      let checkCookWay = false;
      let checkIngredient = false;
      if (this.foodTypesFilter !== undefined && this.foodTypesFilter.length > 0) {
        this.foodTypesFilter.forEach(foodType => {
          for (let ftype of recipe.foodType) {
            if (ftype.foodTypeCode === foodType.foodTypeCode) {
              checkFoodType = true;
            }
          }
        });
      } else {
        checkFoodType = true;
      }
      if (this.countrysFilter !== undefined && this.countrysFilter.length > 0) {
        this.countrysFilter.forEach(country => {
          for (let ftype of recipe.country) {
            if (ftype.countryCode === country.countryCode) {
              checkCountry = true;
            }
          }
        });
      } else {
        checkCountry = true;
      }
      if (this.cookWaysFilter !== undefined && this.cookWaysFilter.length > 0) {
        this.cookWaysFilter.forEach(cookWay => {
          for (let ftype of recipe.cookWay) {
            if (ftype.cookWayCode === cookWay.cookWayCode) {
              checkCookWay = true;
            }
          }
        });
      } else {
        checkCookWay = true;
      }
      if (this.ingredientsFilter !== undefined && this.ingredientsFilter.length > 0) {
        this.ingredientsFilter.forEach(cookWay => {
          for (let ftype of recipe.cookWay) {
            if (ftype.cookWayCode === cookWay.cookWayCode) {
              checkIngredient = true;
            }
          }
        });
      } else {
        checkIngredient = true;
      }
      if (checkCookWay === true && checkCountry === true && checkFoodType === true && checkIngredient === true) {
        tempArr.push(recipe);
      }
    }
    if (this.foodTypesFilter.length === 0 && this.cookWaysFilter.length === 0
      && this.countrysFilter.length === 0 && this.ingredientsFilter.length === 0) {
      this.recipes = this.recipesFilter;
    } else {
      this.recipes = tempArr;
    }
    if (this.recipes.length > 0) {
      this.countRecipe = this.recipes.length;
    } else {
      this.countRecipe = 0;
    }
  }

  getFoodTypes() {
    this.countryService.getFoodTypes().subscribe(foodTypes => {
      this.foodTypes = foodTypes;
      this.foodTypes.forEach(foodType => {
        foodType.status = false;
      });
      this.foodTypes = this.foodTypes.sort((a, b) => a.foodTypeCode > b.foodTypeCode ? 1 : -1);
    });
  }

  getCountrys() {
    this.countryService.getCountrys().subscribe(countrys => {
      this.countrys = countrys;
      this.countrys.forEach(country => {
        country.status = false;
      });
      this.countrys = this.countrys.sort((a, b) => a.countryCode > b.countryCode ? 1 : -1);
    });
  }

  getCookWays() {
    this.countryService.getCookWays().subscribe(cookWay => {
      cookWay.forEach(cook => {
        cook.status = false;
        if (cook.cookWayCode === 'NAM') {
          this.ingredients.push(cook);
        } else if (cook.cookWayCode === 'DAU') {
          this.ingredients.push(cook);
        } else if (cook.cookWayCode === 'CUQ') {
          this.ingredients.push(cook);
        } else if (cook.cookWayCode === 'RAU') {
          this.ingredients.push(cook);
        } else {
          this.cookWays.push(cook);
        }
      });
      this.ingredients = this.ingredients.sort((a, b) => a.cookWayCode > b.cookWayCode ? 1 : -1);
      this.cookWays = this.cookWays.sort((a, b) => a.cookWayCode > b.cookWayCode ? 1 : -1);
    });

  }

  getRecipe = () => {
    this.service.getRecipes().subscribe(recipes => {

      recipes.forEach(recipe => {
        recipe.like = false;
        if (recipe.hardLevel !== undefined) {
          if (recipe.hardLevel === '') {
            recipe.hardLevel = 'không xác định';
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
        if (recipe.user.imageUrl === undefined) {
          recipe.user.imageUrl = 'jbiajl3qqdzshdw0z749';
        }
      });
      this.userObject.email = localStorage.getItem('email');
      this.recipeService.findInterest(this.userObject).subscribe(data => {
        let interests = data.body['interests'];
        this.interests = interests;
        recipes.forEach(function(recipe) {
          recipe.like = false;
          if (interests !== undefined) {
            for (let interest of interests) {
              if (interest.objectId._id === recipe._id && interest.objectType === '2') {
                recipe.like = true;
              }
            }
          }

          if (recipe.user.imageUrl === undefined) {
            recipe.user.imageUrl = 'jbiajl3qqdzshdw0z749';
          }
        });
      });
      this.recipes = recipes;
      this.recipesFilter = this.recipes;
      this.countRecipe = this.recipesFilter.length;
      this.loadingSuccess = true;
    });
  };

  onChangedIngredient(ingredient: any) {
    if (this.showIngredient === false) {

      this.showIngredient = true;
      this.showFoodType = false;
      this.showCountrys = false;
      this.showCookWays = false;
      console.log('add');
    }
    ingredient.status = true;
  }

  onChangedCookWay(cookWay: any) {
    if (this.showCookWays === false) {

      this.showCookWays = true;
      this.showIngredient = false;
      this.showFoodType = false;
      this.showCountrys = false;

    }
    cookWay.status = true;
  }

  onChangedCountry(country: any) {
    if (this.showCountrys === false) {
      this.showCountrys = true;
      this.showIngredient = false;
      this.showFoodType = false;
      this.showCookWays = false;
    }
    country.status = true;
  }

  onChangedFoodType(foodType: any) {
    if (this.showFoodType === false) {
      this.showFoodType = true;
      this.showIngredient = false;
      this.showCountrys = false;
      this.showCookWays = false;

    }
    foodType.status = true;
  }


  likeRecipe(recipe: any, index: any) {
    this.isAuthenicate = localStorage.getItem('email') !== '' ? true : false;
    if (this.isAuthenicate === false) {
      console.log('false');
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      return;
    }
    recipe.like = true;
    let user = localStorage.getItem('email');
    let interestObject = new Object({
      user: user,
      objectId: recipe,
      objectType: '2'
    });
    let id = 'heart' + index;
    const radio: HTMLElement = document.getElementById(id);
    radio.style.color = 'red';
    radio.style.opacity = '0.8';
    this.recipeService.likeRecipe(interestObject).subscribe((data) => {
      if (data !== undefined) {
        console.log('success');
        let userObject = new Object({
          email: recipe.user.email
        });
        // this.userService.likeAddPoint(userObject).subscribe((data) => {
        //   if (data.body['status'] === 200) {
        //     console.log('success')
        //
        //   }
        // });
      }
    });
  }

  getFoodTypeValues(ev, data) {
    const foodType = new FoodType();
    foodType.foodTypeCode = data.foodTypeCode;
    foodType.foodTypeName = data.foodTypeName;
    if (ev.target.checked) {
      const removeIndex = this.foodTypes.findIndex(itm => itm.foodTypeCode === data.foodTypeCode);
      if (removeIndex !== -1) {
        this.foodTypes.splice(removeIndex, 1);
      }
      // Pushing the object into array
      foodType.status = true;
      this.foodTypes.push(foodType);
      this.foodTypesFilter.push(foodType);
      const radio: HTMLElement = document.getElementById('food-type');
      radio.style.color = 'white';
      radio.style.background = '#c0f072';
    } else {

      const removeIndex = this.foodTypes.findIndex(itm => itm.foodTypeCode === data.foodTypeCode);
      if (removeIndex !== -1) {
        this.foodTypes.splice(removeIndex, 1);
      }
      // Pushing the object into array
      foodType.status = false;
      this.foodTypes.push(foodType);
      const removeIndex1 = this.foodTypesFilter.findIndex(itm => itm.foodTypeCode === data.foodTypeCode);
      if (removeIndex1 !== -1) {
        this.foodTypesFilter.splice(removeIndex1, 1);
      }

    }
    if (this.foodTypesFilter.length === 0) {
      const radio: HTMLElement = document.getElementById('food-type');
      radio.style.color = 'black';
      radio.style.background = '#e7e7e7';
    }
    this.foodTypes = this.foodTypes.sort((a, b) => a.foodTypeCode > b.foodTypeCode ? 1 : -1);
    this.loadFilter();
  }

  getCountryValues(ev, data) {
    const country = new Country();
    country.countryCode = data.countryCode;
    country.countryName = data.countryName;
    if (ev.target.checked) {
      const removeIndex = this.countrys.findIndex(itm => itm.countryCode === data.countryCode);
      if (removeIndex !== -1) {
        this.countrys.splice(removeIndex, 1);
      }
      // Pushing the object into array
      country.status = true;
      this.countrys.push(country);
      this.countrysFilter.push(country);
      const radio: HTMLElement = document.getElementById('country');
      radio.style.color = 'white';
      radio.style.background = '#c0f072';
    } else {
      const removeIndex = this.countrys.findIndex(itm => itm.countryCode === data.countryCode);
      if (removeIndex !== -1) {
        this.countrys.splice(removeIndex, 1);
      }
      const removeIndex1 = this.countrysFilter.findIndex(itm => itm.countryCode === data.countryCode);
      if (removeIndex1 !== -1) {
        this.countrysFilter.splice(removeIndex1, 1);
      }
      // Pushing the object into array
      country.status = false;
      this.countrys.push(country);
    }
    if (this.countrysFilter.length === 0) {
      const radio: HTMLElement = document.getElementById('country');
      radio.style.color = 'black';
      radio.style.background = '#e7e7e7';
    }
    this.countrys = this.countrys.sort((a, b) => a.countryCode > b.countryCode ? 1 : -1);
    this.loadFilter();
  }

  getCookWayValues(ev, data) {
    const cookWay = new CookWay();
    cookWay.cookWayCode = data.cookWayCode;
    cookWay.cookWayName = data.cookWayName;
    if (ev.target.checked) {
      const removeIndex = this.cookWays.findIndex(itm => itm.cookWayCode === data.cookWayCode);
      if (removeIndex !== -1) {
        this.cookWays.splice(removeIndex, 1);
      }
      // Pushing the object into array
      cookWay.status = true;
      this.cookWays.push(cookWay);
      this.cookWaysFilter.push(cookWay);

      const radio: HTMLElement = document.getElementById('CookWay');
      radio.style.color = 'white';
      radio.style.background = '#c0f072';
    } else {
      const removeIndex = this.cookWays.findIndex(itm => itm.cookWayCode === data.cookWayCode);
      if (removeIndex !== -1) {
        this.cookWays.splice(removeIndex, 1);
      }
      const removeIndex1 = this.cookWaysFilter.findIndex(itm => itm.cookWayCode === data.cookWayCode);
      if (removeIndex1 !== -1) {
        this.cookWaysFilter.splice(removeIndex1, 1);
      }
      // Pushing the object into array
      cookWay.status = false;
      this.cookWays.push(cookWay);
    }
    if (this.cookWaysFilter.length === 0) {
      const radio: HTMLElement = document.getElementById('CookWay');
      radio.style.color = 'black';
      radio.style.background = '#e7e7e7';
    }
    this.cookWays = this.cookWays.sort((a, b) => a.cookWayCode > b.cookWayCode ? 1 : -1);
    this.loadFilter();
  }

  getIngredientValues(ev, data) {
    const cookWay = new CookWay();
    cookWay.cookWayCode = data.cookWayCode;
    cookWay.cookWayName = data.cookWayName;
    if (ev.target.checked) {
      const removeIndex = this.ingredients.findIndex(itm => itm.cookWayCode === data.cookWayCode);
      if (removeIndex !== -1) {
        this.ingredients.splice(removeIndex, 1);
      }
      // Pushing the object into array
      cookWay.status = true;
      this.ingredients.push(cookWay);
      this.ingredientsFilter.push(cookWay);
      const radio: HTMLElement = document.getElementById('ingredient');
      radio.style.color = 'white';
      radio.style.background = '#c0f072';
    } else {
      const removeIndex = this.ingredients.findIndex(itm => itm.cookWayCode === data.cookWayCode);
      if (removeIndex !== -1) {
        this.ingredients.splice(removeIndex, 1);
      }
      const removeIndex1 = this.ingredientsFilter.findIndex(itm => itm.cookWayCode === data.cookWayCode);
      if (removeIndex1 !== -1) {
        this.ingredientsFilter.splice(removeIndex1, 1);
      }
      // Pushing the object into array
      cookWay.status = false;
      this.ingredients.push(cookWay);
    }
    if (this.ingredientsFilter.length === 0) {
      const radio: HTMLElement = document.getElementById('ingredient');
      radio.style.color = 'black';
      radio.style.background = '#e7e7e7';
    }
    this.ingredients = this.ingredients.sort((a, b) => a.cookWayCode > b.cookWayCode ? 1 : -1);
    this.loadFilter();
  }

  dislikeRecipe(recipe: any, index: any) {
    if (this.isAuthenicate !== true) {
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      return;
    }
    recipe.like = false;
    let user = localStorage.getItem('email');
    let interestObject = new Object({
      user: user,
      objectId: recipe,
      objectType: '2'
    });
    let id = 'heart' + index;
    const radio: HTMLElement = document.getElementById(id);
    radio.style.color = 'white';
    radio.style.opacity = '0.4';
    this.recipeService.dislikeRecipe(interestObject).subscribe((data) => {
      if (data !== undefined) {
        let userObject = new Object({
          email: recipe.user.email
        });
        // this.userService.dislikeremovePoint(userObject).subscribe((data) => {
        //   if (data.body['status'] === 200) {
        //     console.log('success')
        //
        //   }
        // });
      }


    });
  }

  addBookmark(recipe: Recipe) {
    this.message = '';
    if (this.isAuthenicate !== true) {
      console.log(this.isAuthenicate);
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      return;
    }
    this.addRecipe = recipe;
    const radio: HTMLElement = document.getElementById('button111');
    console.log(radio);
    radio.click();
  }

  addRecipeBookMark(gallery: any) {
    if (gallery.recipe !== undefined) {
      for (let recipe of gallery.recipe) {
        if (recipe.recipeName === this.addRecipe.recipeName) {
          this.message = 'Công thức đã có trong bộ sưu tập';
          setTimeout(() => {
            this.message = '';
            this.loading = false;
          }, 2000);
          return;
        }
      }
    }
    if (this.loading === true) {
      return;
    }
    this.loading = true;
    this.galleryObject._id = gallery._id;
    this.galleryObject.recipe = this.addRecipe;
    this.galleryService.addGallery(this.galleryObject).subscribe(data => {
      if (data.body['status'] === 200) {
        let gallery = data.body['gallery'];
        this.message = data.body['message'];
        setTimeout(() => {
          const radio: HTMLElement = document.getElementById('close-modal');
          radio.click();
          this.loading = false;
        }, 4000);

      } else {
        this.loading = false;
      }
    });
  }

}
