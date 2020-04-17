import {Component, Input, OnInit} from '@angular/core';
import {Gallery} from 'src/app/shared/model/gallery';
import {Recipe} from 'src/app/shared/model/recipe';
import {CookieService} from 'ngx-cookie-service';
import {RecipeService} from 'src/app/shared/service/recipe-service.service';
import {GalleryService} from 'src/app/shared/service/gallery.service';

@Component({
  selector: 'app-add-bookmark',
  templateUrl: './add-bookmark.component.html',
  styleUrls: ['./add-bookmark.component.css']
})
export class AddBookmarkComponent implements OnInit {
  message: string = null;
  isAuthenicate = false;
  searchText;
  personalGallery: Gallery[] = [];

  @Input() childMessage: Recipe;
  galleryObject = {
    _id: '',
    recipe: this.childMessage
  };
  errMessage = '';

  constructor(
    private cookie: CookieService,
    private recipeService: RecipeService,
    private galleryService: GalleryService
  ) {
    this.isAuthenicate = this.cookie.get('email') !== '' ? true : false;
  }

  ngOnInit() {
    this.getPersonalGallery();
  }

  addBookmark() {

    this.message = '';
    if (this.isAuthenicate !== true) {
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
    //check công thức đã tồn tại trong bộ sưu tập chưa
    if (gallery.recipe !== undefined) {
      const recipes = gallery.recipe;
      recipes.forEach((recipe) => {
        if (recipe.recipeName === this.childMessage.recipeName) {
          this.errMessage = 'Công thức của bạn đã có trong bộ sưu tâp! Vui lòng chọn công thức khác';
          const radio: HTMLElement = document.getElementById('modal-button113');
          radio.click();
          const radio1: HTMLElement = document.getElementById('close-modal5');
          radio1.click();
          return;
        }
      });
    }
    this.galleryObject._id = gallery._id;
    this.galleryObject.recipe = this.childMessage;
    console.log(this.galleryObject);
    this.galleryService.addGallery(this.galleryObject).subscribe(data => {
      if (data.body['status'] === 200) {
        this.message = data.body['message'];
        console.log(this.message);
        setTimeout(() => {
          const radio: HTMLElement = document.getElementById('close-modal5');
          radio.click();
          this.message = '';
        }, 4000);

      } else {
        this.errMessage = data.body['message'];
        const radio: HTMLElement = document.getElementById('modal-button113');
        radio.click();
        const radio1: HTMLElement = document.getElementById('close-modal5');
        radio1.click();
      }
    });
  }

  getPersonalGallery() {
    const email = this.cookie.get('email');

    if (email !== '') {
      this.galleryService.getGalleryies().subscribe(data => {
        if (data != null) {
          for (const gallery of data) {
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
}
