import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RecipeService} from 'src/app/shared/service/recipe-service.service';
import {Recipe} from 'src/app/shared/model/recipe';
import {CookieService} from 'ngx-cookie-service';
import {UserService} from 'src/app/shared/service/user.service.';

import {FormBuilder, FormGroup} from '@angular/forms';
import {LoginServiceService} from 'src/app/shared/service/login-service.service';
import {Gallery} from 'src/app/shared/model/gallery';
import {GalleryService} from 'src/app/shared/service/gallery.service';
import {Comment} from 'src/app/shared/model/comment';
import {ChatService} from 'src/app/shared/service/chat.service';
import {AppSetting} from '../../appsetting';
import {DomSanitizer, SafeResourceUrl, Title} from '@angular/platform-browser';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  recipe: Recipe;
  cookSteps: [] = [];
  userObject = {
    content: '',
    image: '',
    imageUrl: ''
  };
  userLogin = {
    email: '',
    password: ''
  };
  personalGallery: Gallery[] = [];
  galleryObject = {
    _id: '',
    recipe: Recipe
  };
  interestObject = {
    user: '',
    objectId: Recipe,
    objectType: ''
  };
  viewFull = true;
  totalPoint: number = 0;
  doneCount: number = 0;
  addRecipe = Recipe;
  submitted = false;
  isAuthenicate: boolean = false;
  showModal: boolean = false;
  isModeration: boolean = false;
  imageUrl: string = 'jbiajl3qqdzshdw0z749';
  recipes: Recipe[] = [];
  checkDone = false;
  registerForm: FormGroup;
  errorMessage: string = null;
  multiplyElement: number = 1;
  oldMultiplyElement: number;
  likeUser: boolean = false;
  done: boolean = false;
  showImageStep: boolean = false;
  prepared: number;
  totalCookingTime: number;
  totalRecipe: number = 0;
  recipeComment: Comment[] = [];
  lstComment: Comment[];
  loadingRest = false;
  loading = false;
  loadingSuccess1 = false;
  waitingRecipe = false;
  message = null;
  baseImageUrl = AppSetting.BASE_IMAGE_URL;
  id: string;
  displayURL: SafeResourceUrl;
  icon = 'highlight_off';
  showVideo: boolean = false;
  imageAddDone: boolean = false;
  registerComment: boolean = false;
  resetAll: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private cookie: CookieService,
    private recipeService: RecipeService,
    private userService: UserService,
    private _loginService: LoginServiceService,
    private formBuilder: FormBuilder,
    private _router: Router,
    private galleryService: GalleryService,
    private chatService: ChatService,
    private sanitizer: DomSanitizer,
    private titleMain: Title,
  ) {

  }

  get f() {
    return this.registerForm.controls;
  }

  ngOnInit() {

    this.getPersonalGallery();
    this.registerForm = this.formBuilder.group({

      content: [''],
      image: [''],
      imageUrl: ['']
    });
    this.isModeration = localStorage.getItem('role') !== '';
    this.isAuthenicate = localStorage.getItem('email') !== '';
    this.id = this.route.snapshot.params.id;
    this.getRecipeDetail(this.id);
  }

  getImageSrcTypeRoom(event: any) {
    const id = 'imageArray';
    const pshArrayImage = new Set();
    const str = '[' + event.toString().replace(/}\n?{/g, '},{') + ']';
    JSON.parse(str).forEach((obj) => {
      pshArrayImage.add(obj.filePath);
    });
    if (pshArrayImage.size > 5) {
      this.message = 'Bạn chỉ có thể nhập 5 ảnh cho 1 bước!';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
    }
    const newImage = Array.from(pshArrayImage).join(',');
    console.log('đây là mảng ảnh mới:' + newImage);
    const radio = (document.getElementById(id) as HTMLInputElement);
    radio.value = newImage;
  }

  getIndexDelete(event: any) {
    const id = 'imageArray';
    const value = (document.getElementById(id) as HTMLInputElement).value;
    const radio = (document.getElementById(id) as HTMLInputElement);
    radio.value = '';
  }

  allowAddImage(event) {
    this.imageAddDone = !this.imageAddDone;
  }

  registerCommentUpload() {
    this.registerComment = true;
  }

  getPersonalGallery() {
    let email = localStorage.getItem('email');

    if (email !== '') {
      this.galleryService.getGalleryies().subscribe(data => {
        if (data != null) {
          for (let gallery of data) {
            if (gallery.user.email === email) {
              if (gallery.recipe.length > 0) {
                gallery.image = AppSetting.BASE_IMAGE_URL + gallery.recipe[0].imageUrl;
              } else {
                gallery.image = AppSetting.BASE_IMAGE_URL + 'default-gallery.png';
              }
              this.personalGallery.push(gallery);
            }
          }
        }
      });
    }
  }

  getRecipeDetail(id: any) {

    this.recipeService.getRecipeDetail(id).subscribe(data => {
      this.recipe = data['recipe'];
      if (this.recipe !== undefined && this.recipe.ingredients.length > 0) {
        for (let ingredient of this.recipe.ingredients) {
          ingredient.quantitative = parseInt(ingredient.quantitative) * this.multiplyElement;
          this.oldMultiplyElement = this.multiplyElement;
        }
      }
      if (this.recipe !== undefined && this.recipe.cockStep.length > 0) {
        for (let ingredient of this.recipe.ingredients) {
          ingredient.quantitative = parseInt(ingredient.quantitative) * this.multiplyElement;
          this.oldMultiplyElement = this.multiplyElement;
        }
        for (let cookStep of this.recipe.cockStep) {
          const arrayTemp = cookStep.image;
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
        this.waitingRecipe = this.recipe.status !== 1;
        this.loadingSuccess1 = true;
        const urlString = this.recipe.videoLink;
        let videoId = '';
        if (urlString.includes('https:')) {
          const urlVIdeo = new URL(urlString);
          videoId = urlVIdeo.searchParams.get('v');
        } else {
          videoId = urlString;
        }
        this.displayURL = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + videoId);
        this.getRecipes();
        this.showVideo = false;
        this.titleMain.setTitle(this.recipe.recipeName);
      }
    });
  }

  getRecipes() {
    this.recipeService.getRecipes().subscribe(recipeArray => {
      let arr: Recipe[] = [];
      for (let recip of recipeArray) {
        for (let cookCheck of this.recipe.cookWay) {
          let cookWayArr = recip.cookWay;
          for (let cokkway of cookWayArr) {
            if (
              cookCheck.cookWayCode === cokkway.cookWayCode &&
              recip._id !== this.recipe._id
            ) {
              arr.push(recip);
            }
          }
        }
        if (this.recipe.user._id === recip.user._id) {
          this.totalRecipe++;
        }
      }
      this.userLogin.email = localStorage.getItem('email');
      this.recipeService.findInterest(this.userLogin).subscribe(data => {
        const interests = data.body['interests'];
        for (let interst of interests) {
          if (interst.objectId._id === this.recipe._id) {
            this.likeUser = true;

          }
        }
      });
      this.recipes = arr.filter((item, pos) => {
        return arr.indexOf(item) === pos;
      });
      this.doneCount = this.recipe.doneCount;
      this.totalPoint = this.recipe.totalPoint;
      this.getComent();
    });
  }


  getComent() {
    this.doneCount = 0;
    this.recipeComment.length = 0;
    this.recipeService.getComments().subscribe(data => {
      if (data !== undefined) {
        this.lstComment = data['comments'];
        for (const comment of this.lstComment) {
          if (comment.recipe.recipeName === this.recipe.recipeName) {
            if (comment.type === 1) {
              this.doneCount++;
              comment.type = 'Đã thực hiện';
            } else {
              comment.type = '';
            }
            if (comment.imageUrl !== undefined && comment.imageUrl.length > 0) {
              comment.imageUrl = comment.imageUrl.split(',');
            }
            if (comment.user.email === localStorage.getItem('email')) {
              this.recipe.like = true;
            }
            this.recipeComment.push(comment);
          }
        }
      }
    });
  }

  countIngredient(multiplyElement: any) {
    if (this.multiplyElement < 0) {
      alert('Giá trị nhập vào  phải lớn hơn 0');
      this.multiplyElement = 1;
      return;
    }
    if (this.recipe !== undefined && this.recipe.ingredients.length > 0) {
      for (let ingredient of this.recipe.ingredients) {
        let quantity =
          (parseInt(ingredient.quantitative) / this.oldMultiplyElement) *
          this.multiplyElement;
        ingredient.quantitative = quantity;
      }
      this.oldMultiplyElement = this.multiplyElement;
    }
  }

  video() {
    this.showVideo = true;
  }

  loadPage() {
    console.log('load');
    window.location.reload();
    this.chatService.identifyUser();
  }

  fullImage() {
    this.viewFull = true;
    var arrayNoimag = Array.from(
      document.getElementsByClassName('noImage') as HTMLCollectionOf<HTMLElement>
    );
    arrayNoimag.forEach(element => {
      element.style.height = '300px';
      element.style.minHeight = '400px';
    });
    var arrayNoImage = Array.from(
      document.getElementsByClassName('bigContent') as HTMLCollectionOf<HTMLElement>
    );
    arrayNoImage.forEach(element => {
      element.style.height = '300px';
      element.style.minHeight = '400px';
    });
    this.showImageStep = false;
  }

  public changeIcon(event: any, index: number) {
    const id = 'icon' + index;
    const radio: HTMLElement = document.getElementById(id);

    if (radio.style.color === 'lightgreen') {
      radio.style.color = 'gray';
    } else {
      radio.style.color = 'lightgreen';
    }
  }

  noImage() {
    this.viewFull = false;
    var arrayNoimag = Array.from(
      document.getElementsByClassName('noImage') as HTMLCollectionOf<HTMLElement>
    );
    arrayNoimag.forEach(element => {
      element.style.height = 'auto';
      element.style.minHeight = '150px';
    });
    var arrayNoImage = Array.from(
      document.getElementsByClassName('bigContent') as HTMLCollectionOf<HTMLElement>
    );
    arrayNoImage.forEach(element => {
      element.style.height = 'auto';
      element.style.minHeight = '150px';
    });
    this.showImageStep = true;
  }

  likeRecipe(recipe: any, i: any) {
    if (this.isAuthenicate === false) {
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      return;
    }
    if (this.loadingRest === true) {
      console.log('like vẫn thích vào đó' + this.loadingRest);
      return;
    }
    console.log('like');
    this.loadingRest = true;
    let user = recipe.user;
    this.interestObject.user = localStorage.getItem('email');
    this.interestObject.objectId = recipe;
    this.interestObject.objectType = '2';
    this.recipeService.likeRecipe(this.interestObject).subscribe(data => {
      if (data !== undefined) {
        console.log(data);
        this.recipe = data.body['recipe'];
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
        this.loadingRest = false;
        this.likeUser = true;
        console.log('success');
        this.totalPoint++;
        // this.userService.likeAddPoint(userObject).subscribe(data => {
        //   if (data.body['status'] === 200) {
        //     console.log('success');
        //   }
        // });
      }
    });
  }

  dislikeRecipe(recipe: any, i: any) {
    if (this.isAuthenicate === false) {
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      return;
    }
    if (this.loadingRest === true) {
      console.log('dislike vẫn thích vào đó' + this.loadingRest);
      return;
    }
    console.log('dislike');
    let user = recipe.user;
    this.interestObject.user = localStorage.getItem('email');
    this.interestObject.objectId = recipe;
    this.interestObject.objectType = '2';
    this.recipeService.dislikeRecipe(this.interestObject).subscribe(data => {
      if (data !== undefined) {
        this.recipe.totalPoint--;
        let userObject = new Object({
          email: user.email
        });
        // this.userService.dislikeremovePoint(userObject).subscribe(data => {
        //   if (data.body['status'] === 200) {
        //     console.log('success');
        //     this.totalPoint--;
        //   }
        // });
        this.loadingRest = false;
        this.likeUser = false;
      }
    });
  }


  addDoneRecipe(recipe: any) {
    let user = localStorage.getItem('email');
    if (this.isAuthenicate === false && user === '') {
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      return;
    }
    this.loading = true;
    this.done = true;

    const doneObject = new Object({
      user,
      recipe: recipe,
      type: 1,
      content: '',
      imageUrl: ''
    });
    this.recipeService.addComment(doneObject).subscribe(data => {
      const status = data.body['status'];
      console.log(status);
      if (status === 200) {
        this.doneCount = this.recipe.doneCount;
        this.recipe = data.body['recipe'];
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
        this.message = 'Xác nhận thực hiện';
        const radio: HTMLElement = document.getElementById('modal-button10');
        radio.click();
        console.log('success');
        setTimeout(() => {
          window.location.reload();
          this.chatService.identifyUser();
        }, 3000);
        this.loading = false;
      } else {
        this.message = data.body['message'];
        const radio: HTMLElement = document.getElementById('modal-button10');
        radio.click();
        this.loading = false;
      }
    });
  }

  addComment() {
    let user = localStorage.getItem('email');
    this.submitted = true;
    if (this.isAuthenicate === false && user === '') {
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      return;
    }
    if (this.registerForm.value.content === '') {
      this.message = 'Không được để trống nội dung bình luận';
      const radio: HTMLElement = document.getElementById('modal-button10');
      radio.click();
      return;
    }
    this.userObject = this.registerForm.value;
    this.done = true;
    let typeDone;
    if (this.checkDone === true) {
      typeDone = 1;
    } else {
      typeDone = 0;
    }
    this.loading = true;
    let inputValue = '';
    const input = document.getElementById('imageArray');
    if (input !== undefined || true) {
      inputValue = (document.getElementById('imageArray') as HTMLInputElement).value;
    }

    const doneObject = new Object({
      user: user,
      recipe: this.recipe,
      type: typeDone,
      content: this.userObject.content,
      imageUrl: inputValue
    });

    this.recipeService.addComment(doneObject).subscribe(data => {
      const status = data.body['status'];
      console.log(status);
      if (status === 200) {

        this.recipe = data.body['recipe'];
        console.log('success');
        let comment: Comment;
        comment = data.body['comment'];
        if (comment.type === 1) {
          comment.type = 'Đã thực hiện';
          this.doneCount++;
        } else {
          comment.type = '';
        }
        comment.imageUrl = comment.imageUrl.split(',');
        this.recipeComment.push(comment);
        this.recipeComment.sort((a, b) => {
          if (a.order > b.order) {
            return -1;
          } else if (a.order < b.order) {
            return 1;
          } else {
            return 0;
          }
        });

        // reset form
        this.loading = false;
        this.registerForm.reset();
        const textArea = (document.getElementById('content') as HTMLInputElement);
        textArea.value = '';
        this.imageAddDone = false;
        this.resetAll = true;
        this.checkDone = false;
        this.registerComment = false;
        this.message = data.body['message'];
        const radio: HTMLElement = document.getElementById('modal-button10');
        radio.click();
      } else {
        this.message = data.body['message'];
        const radio: HTMLElement = document.getElementById('modal-button10');
        radio.click();

      }

    });
  }


  addBookmark(recipe: any) {

    this.message = '';
    if (this.isAuthenicate !== true) {
      // tslint:disable-next-line:no-shadowed-variable
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      return;
    }
    this.addRecipe = recipe;
    const radio: HTMLElement = document.getElementById('modal-button1');
    radio.click();
  }

  addRecipeBookMark(gallery: any) {
    if (gallery.recipe !== undefined) {
      for (const recipe of gallery.recipe) {
        if (recipe.name === this.addRecipe.name) {
          this.message = 'Công thức đã có trong bộ sưu tập';
          return;
        }
      }
    }
    this.galleryObject._id = gallery;
    this.galleryObject.recipe = this.addRecipe;
    this.galleryService.addGallery(this.galleryObject).subscribe(data => {
      if (data.body['status'] === 200) {
        let gallery = data.body['gallery'];
        this.message = data.body['message'];
        setTimeout(() => {
          const radio: HTMLElement = document.getElementById('close-modal');
          radio.click();
        }, 4000);
      }
    });
  }
}
