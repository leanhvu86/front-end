import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Gallery } from '../../../shared/model/gallery';
import { CookieService } from 'ngx-cookie-service';
import { GalleryService } from '../../../shared/service/gallery.service';
import { UserService } from '../../../shared/service/user.service.';
import { Recipe } from '../../../shared/model/recipe';
import { RecipeService } from 'src/app/shared/service/recipe-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-app-recipe-gallery',
  templateUrl: './app-recipe-gallery.component.html',
  styleUrls: ['./app-recipe-gallery.component.css']
})
export class AppRecipeGalleryComponent implements OnInit {
  submitted: boolean = false;
  registerForm: FormGroup;
  isAuthenicate: boolean;
  @Input() childMessage: Gallery;
  galleryObject = {
    content: '',
    _id: '',
    name: '',
    user: '',
    recipes: []
  };
  message: String = '';
  gallerys: Gallery[] = [];
  oldRecipes: Recipe[] = [];
  newRecipe: Recipe[] = [];
  errorMessage: String = '';
  recipes: Recipe[] = []
  constructor(
    private cookie: CookieService,
    private formBuilder: FormBuilder,
    private galleryService: GalleryService,
    private userService: UserService,
    private recipeService: RecipeService,
    private _route: ActivatedRoute
  ) {
    this.isAuthenicate = this.cookie.get('email') !== '' ? true : false;
    console.log(this.isAuthenicate);
  }

  ngOnInit() {
    this.oldRecipes = this.childMessage.recipe;
    this.newRecipe = this.oldRecipes;
    this.registerForm = this.formBuilder.group({
      name: [this.childMessage.name, [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      content: [this.childMessage.content, [Validators.required, Validators.minLength(20), Validators.maxLength(500)]]
      // , image: ['']
    });
    console.log(this.oldRecipes.length + 'công thức của bộ sưu tập');
    this.getRecipes();

  }

  get f() {
    return this.registerForm.controls;
  }

  removeRecipe(recipe: any, i: any) {
    // const radio: HTMLElement = document.getElementById('old' + i);
    // radio.style.display = 'none';
    recipe.like = false;
    this.newRecipe = this.newRecipe.filter(obj => obj.recipeName !== recipe.recipeName);
    this.oldRecipes = this.oldRecipes.filter(obj => obj.recipeName !== recipe.recipeName);
    console.log(this.newRecipe.length)
  }
  addRecipe(recipe: any, i: any) {
    recipe.like = true
    this.newRecipe.push(recipe);
    console.log(this.newRecipe.length)
  }

  registerGallery() {
    console.log('add');
    const radio: HTMLElement = document.getElementById('add-recipe-gallery');
    radio.click();
  }

  updateGallery() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    this.galleryObject = this.registerForm.value;

    console.log(this.galleryObject);
    console.log(this.newRecipe)
    let email = this.cookie.get('email');
    this.galleryObject.user = email;
    this.galleryObject.recipes = this.newRecipe;
    this.galleryObject._id = this._route.snapshot.params.id;
    console.log(this.galleryObject);

    this.galleryService.updateGallery(this.galleryObject).subscribe(gallery => {
      console.log(gallery);
      if (gallery !== undefined) {
        this.message = 'Chúc mừng bạn lưu thông tin bộ sưu tập thành công';
        setTimeout(() => {
          const radio: HTMLElement = document.getElementById('close-modal');
          radio.click();
          this.message = '';
          this.registerForm.reset();
          window.location.reload();
        }, 5000);

      }
    });
  }
  getRecipes() {
    this.recipeService.getRecipes().subscribe(recipes => {
      if (recipes !== undefined) {
        this.recipes = recipes;
        this.recipes.forEach(recipe => {
          recipe.like = false;
          for (let recipe of this.oldRecipes) {
            this.recipes = this.recipes.filter(temp =>
              temp.recipeName !== recipe.recipeName)
          }
        })
      }
      console.log(this.recipes.length + 'công thức của website');
    });
  }
}

