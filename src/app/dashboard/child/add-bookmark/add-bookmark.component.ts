import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {Gallery} from 'src/app/shared/model/gallery';
import {Recipe} from 'src/app/shared/model/recipe';
import {CookieService} from 'ngx-cookie-service';
import {RecipeService} from 'src/app/shared/service/recipe-service.service';
import {GalleryService} from 'src/app/shared/service/gallery.service';
import {AlertService} from '../../../shared/animation/_alert';
import {AppSetting} from '../../../appsetting';

@Component({
  selector: 'app-add-bookmark',
  templateUrl: './add-bookmark.component.html',
  styleUrls: ['./add-bookmark.component.css']
})
export class AddBookmarkComponent implements OnInit {
  message: string = null;
  isAuthenticate = false;
  searchText;
  recipe = Recipe;
  personalGallery: Gallery[] = [];
  errMessage = '';
  baseImageUrl = AppSetting.BASE_IMAGE_URL;
  config: any;
  p: number;
  pageSize = 6;

  @Input() childMessage: Recipe;

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.childMessage);
    this.getPersonalGallery();
  }

  constructor(
    private cookie: CookieService,
    private recipeService: RecipeService,
    private galleryService: GalleryService,
    private alertService: AlertService
  ) {
    this.isAuthenticate = localStorage.getItem('email') !== '';
  }

  ngOnInit() {
    this.getPersonalGallery();
  }

  pageChanged(event) {
    this.config.currentPage = event;
  }

  addBookmark() {

    this.message = '';
    if (this.isAuthenticate !== true) {
      // tslint:disable-next-line:no-shadowed-variable
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      return;
    }
    if (this.childMessage === undefined) {
      console.log('Công thức của bạn không hợp lệ');
      return;
    }
    console.log(this.childMessage);
    const radio: HTMLElement = document.getElementById('modal-button-addbookmark');
    radio.click();
  }

  addRecipeBookMark(gallery: any) {
    console.log(gallery);
    if (gallery.recipe !== undefined) {
      console.log(gallery.recipe);
      console.log(this.childMessage);
      for (const recipe of gallery.recipe) {
        if (recipe.recipeName === this.childMessage.recipeName) {
          this.message = 'Công thức đã có trong bộ sưu tập';
          this.alertService.warn(this.message);
          return;
        }
      }
    }
    const galleryObject = {
      _id: gallery._id,
      recipe: this.childMessage
    };
    console.log(this.childMessage);
    console.log(galleryObject);
    this.galleryService.addGallery(galleryObject).subscribe(data => {
      if (data.body['status'] === 200) {
        this.message = data.body['message'];
        console.log(this.message);
        this.alertService.success(this.message);
        setTimeout(() => {
          const radio: HTMLElement = document.getElementById('close-modal5');
          radio.click();
          this.message = '';
        }, 1000);

      } else {
        this.errMessage = data.body['message'];
        this.alertService.error(this.errMessage);
        const radio1: HTMLElement = document.getElementById('close-modal5');
        radio1.click();
      }
    });
  }

  getPersonalGallery() {
    const email = localStorage.getItem('email');

    if (email !== '') {
      this.galleryService.getGalleryies().subscribe(data => {
        if (data != null) {
          for (const gallery of data) {
            if (gallery.user.email === email) {
              if (gallery.recipe.length > 0) {
                gallery.image = gallery.recipe[0].imageUrl;
              } else {
                gallery.image = 'default-gallery.png';
              }
              this.personalGallery.push(gallery);
            }
          }
        }
      });
    }
  }
}
