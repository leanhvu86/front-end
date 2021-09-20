import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Gallery} from '../../../shared/model/gallery';
import {CookieService} from 'ngx-cookie-service';
import {GalleryService} from '../../../shared/service/gallery.service';
import {UserService} from '../../../shared/service/user.service.';
import {Recipe} from '../../../shared/model/recipe';
import {RecipeService} from 'src/app/shared/service/recipe-service.service';
import {ActivatedRoute} from '@angular/router';
import {ChatService} from 'src/app/shared/service/chat.service';
import {AppSetting} from '../../../appsetting';
import {AlertService} from '../../../shared/animation/_alert';

@Component({
  selector: 'app-app-recipe-gallery',
  templateUrl: './app-recipe-gallery.component.html',
  styleUrls: ['./app-recipe-gallery.component.css']
})
export class AppRecipeGalleryComponent implements OnInit {
  submitted = false;
  registerForm: FormGroup;
  isAuthenticate: boolean;
  galleryObject = {
    content: '',
    _id: '',
    name: '',
    user: '',
    recipes: []
  };
  searchText = '';
  message = '';
  gallerys: Gallery[] = [];
  oldRecipes: Recipe[] = [];
  newRecipe: Recipe[] = [];
  errorMessage = '';
  recipes: Recipe[] = [];
  saving = false;
  baseImageUrl = AppSetting.BASE_IMAGE_URL;
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };
  @Input() childMessage: Gallery;

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges(changes: SimpleChanges) {
    this.initGallery();
    console.log(this.childMessage);
  }


  constructor(
    private cookie: CookieService,
    private formBuilder: FormBuilder,
    private galleryService: GalleryService,
    private userService: UserService,
    private recipeService: RecipeService,
    // tslint:disable-next-line:variable-name
    private _route: ActivatedRoute,
    private chatService: ChatService,
    private alertService: AlertService
  ) {
    this.isAuthenticate = localStorage.getItem('email') !== '';
    console.log(this.isAuthenticate);
  }

  ngOnInit() {
    this.initGallery();
  }

  initGallery() {
    this.oldRecipes = this.childMessage.recipe;
    this.oldRecipes.forEach(recipe => {
      this.newRecipe.push(recipe);
    });
    // this.newRecipe = this.oldRecipes;
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
    console.log(this.newRecipe.length);
  }

  addRecipe(recipe: any, i: any) {
    recipe.like = true;
    this.newRecipe.push(recipe);
    console.log(this.newRecipe.length);
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
    this.saving = true;
    this.galleryObject = this.registerForm.value;

    console.log(this.galleryObject);
    console.log(this.newRecipe);
    this.galleryObject.user = localStorage.getItem('email');
    this.galleryObject.recipes = this.newRecipe;
    let id = JSON.stringify(this.childMessage._id);
    id = id.substring(1);
    id = id.substring(0, id.length - 1);
    this.galleryObject._id = id;
    console.log(this.galleryObject);

    this.galleryService.updateGallery(this.galleryObject).subscribe(gallery => {
      console.log(gallery);
      if (gallery !== undefined) {
        this.alertService.success(' Chúc mừng bạn lưu thông tin bộ sưu tập thành công ! ');
        this.registerGallery();
        setTimeout(() => {
          this.message = '';
          window.location.reload();
          this.chatService.identifyUser();
        }, 3000);

      }
    });
  }

  getRecipes() {
    this.recipeService.getRecipes().subscribe(recipes => {
      if (recipes !== undefined) {
        this.recipes = recipes;
        this.recipes.forEach(recipe => {
          recipe.like = false;
          // tslint:disable-next-line:no-shadowed-variable
          for (const recipe of this.oldRecipes) {
            this.recipes = this.recipes.filter(temp =>
              temp.recipeName !== recipe.recipeName);
          }
        });
      }
      console.log(this.recipes.length + 'công thức của website');
    });
  }
}

