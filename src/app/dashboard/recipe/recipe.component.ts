import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../.././shared/service/recipe-service.service'
import { from } from 'rxjs';
import { Recipe } from '../../shared/model/recipe';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/shared/service/user.service.';
import { ActivatedRoute } from '@angular/router';
import { FoodType } from 'src/app/shared/model/foodType';
import { CountryService } from 'src/app/shared/service/country.service';
import { Country } from 'src/app/shared/model/country';
import { CookWay } from 'src/app/shared/model/cookWay';
@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {
  recipes: Recipe[];
  isAuthenicate: boolean = false;
  searchText: string = ''
  showFoodtype: boolean = false;
  showCountrys: boolean = false;
  showCookWays: boolean = false;
  showIngredient: boolean = false;
  foodTypes: FoodType[] = []
  countrys: Country[] = []
  cookWays: CookWay[] = []
  ingredients: CookWay[] = []
  foodTypesFilter: FoodType[] = []
  countrysFilter: Country[] = []
  cookWaysFilter: CookWay[] = []
  recipesFilter: Recipe[] = [];
  empty: Recipe[] = [];
  checkRecipe: Recipe
  constructor(
    private service: RecipeService,
    private cookie: CookieService,
    private recipeService: RecipeService,
    private userService: UserService,
    private router: ActivatedRoute,
    private countryService: CountryService
  ) {
    this.searchText = this.cookie.get('searchText');
    this.cookie.set('searchText', '');
  }

  ngOnInit() {
    this.getRecipe();
    this.getCookWays();
    this.getCountrys();
    this.getFoodTypes()
  }
  video(link: any) {
    console.log(link)
    var url = 'https://www.youtube.com/watch?v=' + link;
    window.open(url, "MsgWindow", "width=600,height=400");
  }

  loadFilter() {
    this.recipes = this.empty
    let tempArr = this.empty
    console.log(this.recipesFilter)
    for (let recipe of this.recipesFilter) {
      let checkFoodType = false;
      let checkCountry = false;
      let checkCookWay = false;
      if (this.foodTypesFilter !== undefined && this.foodTypesFilter.length > 0) {
        this.foodTypesFilter.forEach(foodType => {
          for (let ftype of recipe.foodType) {
            if (ftype.foodTypeCode === foodType.foodTypeCode) {
              checkFoodType = true;
            }
          }
        })
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
        })
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
        })
      } else {
        checkCookWay = true
      }
      if (checkCookWay === true && checkCountry === true && checkFoodType === true) {
        tempArr.push(recipe)
      }
    }
    if (this.foodTypesFilter.length === 0 && this.cookWaysFilter.length === 0 && this.countrysFilter.length === 0) {
      this.recipes = this.recipesFilter
    } else {
      this.recipes = tempArr
    }

    console.log(this.recipes)
  }

  getFoodTypes() {
    this.countryService.getFoodTypes().subscribe(foodTypes => {
      this.foodTypes = foodTypes;
      this.foodTypes.forEach(foodType => {
        foodType.status = false
      })
      this.foodTypes = this.foodTypes.sort((a, b) => a.foodTypeCode > b.foodTypeCode ? 1 : -1);
    });
  }
  getCountrys() {
    this.countryService.getCountrys().subscribe(countrys => {
      this.countrys = countrys;
      this.countrys.forEach(country => {
        country.status = false
      })
      this.countrys = this.countrys.sort((a, b) => a.countryCode > b.countryCode ? 1 : -1);
    });
  }
  getCookWays() {
    this.countryService.getCookWays().subscribe(cookWay => {
      cookWay.forEach(cook => {
        cook.status = false
        if (cook.cookWayCode === 'NAM') {
          this.ingredients.push(cook)
        } else if (cook.cookWayCode === 'DAU') {
          this.ingredients.push(cook)
        } else if (cook.cookWayCode === 'CUQ') {
          this.ingredients.push(cook)
        } else if (cook.cookWayCode === 'RAU') {
          this.ingredients.push(cook)
        } else {
          this.cookWays.push(cook);
        }
      })
      this.ingredients = this.ingredients.sort((a, b) => a.cookWayCode > b.cookWayCode ? 1 : -1);
      this.cookWays = this.cookWays.sort((a, b) => a.cookWayCode > b.cookWayCode ? 1 : -1);
    });

  }
  getRecipe = () => {
    this.service.getAllRecipes().subscribe(data => {
      this.recipes = data
      this.recipesFilter = this.recipes
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
  onChangeofingredient(ingredient: any) {
    if (this.showIngredient === false) {

      this.showIngredient = true;
      this.showFoodtype = false;
      this.showCountrys = false;
      this.showCookWays = false;
      console.log('add');
    }
    ingredient.status = true
  }
  onChangeofCookWay(cookWay: any) {
    if (this.showCookWays === false) {

      this.showCookWays = true;
      this.showIngredient = false;
      this.showFoodtype = false;
      this.showCountrys = false;
    }
    cookWay.status = true;
  }
  onChangeofCountry(country: any) {
    if (this.showCountrys === false) {
      this.showCountrys = true;
      this.showIngredient = false;
      this.showFoodtype = false;
      this.showCookWays = false;
    }
    country.status = true
  }
  onChangeofFoodType(foodType: any) {
    if (this.showFoodtype === false) {
      this.showFoodtype = true;
      this.showIngredient = false;
      this.showCountrys = false;
      this.showCookWays = false;
    }
    foodType.status = true
  }


  likeRecipe(recipe: any, index: any) {
    this.isAuthenicate = this.cookie.get('email') !== "" ? true : false;
    if (this.isAuthenicate === false) {
      console.log('false');
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      return;
    }
    recipe.like = true;
    let user = this.cookie.get('email');
    let interestObject = new Object({
      user: user,
      objectId: recipe,
      objectType: '2'
    })
    let id = 'heart' + index;
    const radio: HTMLElement = document.getElementById(id);
    radio.style.color = 'red';
    radio.style.opacity = '0.8';
    console.log(interestObject)
    this.recipeService.likeRecipe(interestObject).subscribe((data) => {
      if (data !== undefined) {
        console.log('success')
        let userObject = new Object({
          email: recipe.user.email
        })
        this.userService.likeAddPoint(userObject).subscribe((data) => {
          if (data.body['status'] === 200) {
            console.log('success')

          }
        });
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
      foodType.status = true
      this.foodTypes.push(foodType);
      this.foodTypesFilter.push(foodType);
      console.log(this.foodTypesFilter)
      this.loadFilter()
    } else {
      const removeIndex = this.foodTypes.findIndex(itm => itm.foodTypeCode === data.foodTypeCode);
      if (removeIndex !== -1) {
        this.foodTypes.splice(removeIndex, 1);
      }
      // Pushing the object into array
      foodType.status = false
      this.foodTypes.push(foodType);
      const removeIndex1 = this.foodTypesFilter.findIndex(itm => itm.foodTypeCode === data.foodTypeCode);
      if (removeIndex1 !== -1) {
        this.foodTypesFilter.splice(removeIndex1, 1);
      }
      console.log(this.foodTypesFilter)
      this.loadFilter()
    }
    this.foodTypes = this.foodTypes.sort((a, b) => a.foodTypeCode > b.foodTypeCode ? 1 : -1);
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
      country.status = true
      this.countrys.push(country);
      this.countrysFilter.push(country);
      console.log(this.countrysFilter)
      this.loadFilter()
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
      country.status = false
      console.log(this.countrysFilter)
      this.countrys.push(country);
      this.loadFilter()
    }
    this.countrys = this.countrys.sort((a, b) => a.countryCode > b.countryCode ? 1 : -1);
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
      cookWay.status = true
      this.cookWays.push(cookWay);
      this.cookWaysFilter.push(cookWay)
      console.log(this.cookWaysFilter)
      this.loadFilter()
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
      cookWay.status = false
      this.cookWays.push(cookWay);
      console.log(this.cookWaysFilter)
      this.loadFilter()
    }
    this.cookWays = this.cookWays.sort((a, b) => a.cookWayCode > b.cookWayCode ? 1 : -1);
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
      cookWay.status = true
      this.ingredients.push(cookWay);
      this.cookWaysFilter.push(cookWay)
      console.log(this.cookWaysFilter)
      this.loadFilter()
    } else {
      const removeIndex = this.ingredients.findIndex(itm => itm.cookWayCode === data.cookWayCode);
      if (removeIndex !== -1) {
        this.ingredients.splice(removeIndex, 1);
      }
      const removeIndex1 = this.cookWaysFilter.findIndex(itm => itm.cookWayCode === data.cookWayCode);
      if (removeIndex1 !== -1) {
        this.cookWaysFilter.splice(removeIndex1, 1);
      }
      // Pushing the object into array
      cookWay.status = false
      this.ingredients.push(cookWay);
      console.log(this.cookWaysFilter)
      this.loadFilter()
    }
    this.ingredients = this.ingredients.sort((a, b) => a.cookWayCode > b.cookWayCode ? 1 : -1);
  }
  dislikeRecipe(recipe: any, index: any) {
    console.log(recipe);
    console.log(index);
    if (this.isAuthenicate !== true) {
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      return;
    }
    recipe.like = false;
    console.log(recipe.user.email)
    let user = this.cookie.get('email');
    let interestObject = new Object({
      user: user,
      objectId: recipe,
      objectType: '2'
    })
    let id = 'heart' + index;
    const radio: HTMLElement = document.getElementById(id);
    radio.style.color = 'white';
    radio.style.opacity = '0.4';
    console.log(recipe.user.email)
    console.log(interestObject)
    this.recipeService.dislikeRecipe(interestObject).subscribe((data) => {
      if (data !== undefined) {
        let userObject = new Object({
          email: recipe.user.email
        })
        this.userService.dislikeremovePoint(userObject).subscribe((data) => {
          if (data.body['status'] === 200) {
            console.log('success')

          }
        });
      }


    })
    console.log(recipe.like);
  }
}
