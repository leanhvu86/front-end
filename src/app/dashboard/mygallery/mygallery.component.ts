import {Component, OnInit} from '@angular/core';
import {User} from 'src/app/shared/model/user';
import {LoginServiceService} from 'src/app/shared/service/login-service.service';
import {CookieService} from 'ngx-cookie-service';
import {Options} from 'ng5-slider';
import {GalleryService} from 'src/app/shared/service/gallery.service';
import {Gallery} from 'src/app/shared/model/gallery';
import {trigger} from '@angular/animations';
import {fadeIn} from '../../shared/animation/fadeIn';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Recipe} from 'src/app/shared/model/recipe';
import {ActivatedRoute} from '@angular/router';
import {UserService} from 'src/app/shared/service/user.service.';
import {RecipeService} from 'src/app/shared/service/recipe-service.service';
import {ChatService} from 'src/app/shared/service/chat.service';
import {AppSetting} from '../../appsetting';
import {AlertService} from '../../shared/animation/_alert';


@Component({
  selector: 'app-mygallery',
  templateUrl: './mygallery.component.html',
  styleUrls: ['./mygallery.component.css'],
  animations: [
    trigger('fadeIn', fadeIn())
  ]
})
export class MygalleryComponent implements OnInit {
  id: String = '1';
  value: number = 0;
  options: Options = {
    floor: 0,
    ceil: 1000,
    showTicksValues: false,
    disabled: true,
    hideLimitLabels: true,
  };
  deleteCheck = false;
  userObject = {
    email: '',
    password: ''
  };
  deleteId = '';
  message = '';
  myGallery: Gallery[] = [];
  user: User;
  loadPage: boolean = false;
  p: number;
  submitted: boolean = false;
  registerForm: FormGroup;
  isAuthenicate: boolean;
  imageProp: string = 'profile';
  url: string = '';
  galleryObject = {
    content: '',
    _id: '',
    name: '',
    user: '',
    recipes: []
  };
  searchText: string = '';
  gallerys: Gallery[] = [];
  oldRecipes: Recipe[] = [];
  newRecipe: Recipe[] = [];
  errorMessage: string = '';
  recipes: Recipe[] = [];
  saving = false;
  chooseGallery: Gallery;
  baseImageUrl = AppSetting.BASE_IMAGE_URL;

  constructor(
    private cookie: CookieService,
    private formBuilder: FormBuilder,
    private galleryService: GalleryService,
    private userService: UserService,
    private recipeService: RecipeService,
    private _route: ActivatedRoute,
    private _loginService: LoginServiceService,
    private gallerrService: GalleryService,
    private chatService: ChatService,
    private alertService: AlertService
  ) {
  }

  ngOnInit() {
    this.getUserInfo();
    this.chatService.scrollToTop();
    this.getRecipes();
    this.registerForm = this.formBuilder.group({
      name: new FormControl(['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]]),
      content: new FormControl(['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]])
      // , image: ['']
    });
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

  registerGallery(gallery: any) {
    console.log('add');
    this.chooseGallery = gallery;
    this.oldRecipes = this.chooseGallery.recipe;
    this.newRecipe = this.oldRecipes;
    this.getRecipes();
    console.log(this.oldRecipes.length + 'công thức của bộ sưu tập');
    this.registerForm.patchValue({
      name: this.chooseGallery.name,
      content: this.chooseGallery.content
    });

    const radio: HTMLElement = document.getElementById('add-recipe-gallery');
    radio.click();
    console.log(this.registerForm.value);
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
    let id = JSON.stringify(this.chooseGallery._id);
    id = id.substring(1);
    id = id.substring(0, id.length - 1);
    this.galleryObject._id = id;
    console.log(this.galleryObject);

    this.galleryService.updateGallery(this.galleryObject).subscribe(gallery => {
      console.log(gallery);
      if (gallery !== undefined) {
        this.alertService.success(' Chúc mừng bạn lưu thông tin bộ sưu tập thành công ');
        setTimeout(() => {
          const radio: HTMLElement = document.getElementById('close-modal');
          radio.click();
          this.message = '';
          //this.registerForm.reset();
          window.location.reload();
        }, 3000);
        this.chatService.identifyUser();
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
              temp.recipeName !== recipe.recipeName);
          }
        });
      }
      console.log(this.recipes.length + 'công thức của website');
    });
  }

  getGalleryOutput(event: any) {
    // const gallery = JSON.parse(event);
    console.log(event);
    let gallery = event;
    gallery.image = AppSetting.BASE_IMAGE_URL + 'default-gallery.png';
    this.myGallery.push(event);
  }

  getUserInfo() {
    const email = localStorage.getItem('email');
    if (email !== '') {
      this._loginService.testEmail(email).subscribe(data => {


        let user = data.body['user'];
        this.url = AppSetting.BASE_IMAGE_URL + user.imageUrl;
        if (user !== undefined) {
          this.userObject.email = user.email;
          // tslint:disable-next-line:no-shadowed-variable
          this.gallerrService.findGallery(this.userObject).subscribe(data => {
            this.myGallery = data.body['gallerys'];
            for (let gallery of this.myGallery) {
              if (gallery.recipe.length > 0) {
                gallery.image = AppSetting.BASE_IMAGE_URL + gallery.recipe[0].imageUrl;
              } else {
                console.log(gallery.recipe.length);
                gallery.image = AppSetting.BASE_IMAGE_URL + 'default-gallery.png';
              }
            }
            this.user = user;
            this.id = user._id;
            this.loadPage = true;
            if (user.totalPoint > 600) {
              this.value = user.totalPoint;
              user.level = 'Mastee';
            } else if (user.totalPoint > 400) {
              this.value = user.totalPoint;
              user.level = 'Cheffe';
            } else if (user.totalPoint > 250) {
              this.value = user.totalPoint;
              user.level = 'Cookee';
            } else if (user.totalPoint > 100) {
              this.value = user.totalPoint;
              user.level = 'Tastee';
            } else {
              this.value = user.totalPoint;
              user.level = 'Newbee';
            }
          });
        }
      });
    }
  }

  openModal(id: any, name: any) {
    this.deleteId = id;
    this.deleteCheck = true;
    this.message = 'Bạn muốn xóa bộ sưu tập "' + name + '" ?';
    const radio: HTMLElement = document.getElementById('modal-button28');
    radio.click();
  }

  deleteGallery(id: any) {
    if (id === '') {
      this.message = 'Bạn chưa chọn bộ sưu tập. Vui lòng thao tác lại';
      return;
    }
    console.log(id);
    this.galleryObject._id = id;
    this.gallerrService.deleteGallery(this.galleryObject).subscribe(data => {
      this.alertService.success(data.body['message']);

      if (data.body['status'] === 200) {
        this.myGallery = this.myGallery.filter(gallery => gallery._id !== id);
      }
      this.deleteId = '';
      this.deleteCheck = false;
      const radio: HTMLElement = document.getElementById('modal-button28');
      radio.click();
    });
  }
}
