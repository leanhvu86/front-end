import { Component, OnInit, Input } from '@angular/core';
import { Gallery } from 'src/app/shared/model/gallery';
import { Recipe } from 'src/app/shared/model/recipe';
import { CookieService } from 'ngx-cookie-service';
import { RecipeService } from 'src/app/shared/service/recipe-service.service';
import { GalleryService } from 'src/app/shared/service/gallery.service';

@Component({
  selector: 'app-add-bookmark',
  templateUrl: './add-bookmark.component.html',
  styleUrls: ['./add-bookmark.component.css']
})
export class AddBookmarkComponent implements OnInit {
  message: string = null
  showModal: boolean = false;
  isAuthenicate: boolean = false;
  searchText;
  collection = { count: 60, data: [] };
  galleryTop: Gallery[] = []
  personalGallery: Gallery[] = []

  @Input() childMessage: Recipe;
  addRecipe = Recipe
  galleryObject = {
    _id: "",
    recipe: this.childMessage
  };
  constructor(
    private cookie: CookieService,
    private recipeService: RecipeService,
    private galleryService: GalleryService
  ) { this.isAuthenicate = this.cookie.get('email') !== "" ? true : false; }

  ngOnInit() {
    this.getPersonalGallery()
  }
  addBookmark(recipe: any) {

    this.message = ''
    if (this.isAuthenicate !== true) {
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      return;
    }
    console.log(this.childMessage)
    this.addRecipe = recipe
    const radio: HTMLElement = document.getElementById('modal-button-addbookmark');
    radio.click();
  }
  addRecipeBookMark(gallery: any) {
    console.log(gallery)
    if (gallery.recipe !== undefined) {
      for (let recipe of gallery.recipe) {
        if (recipe.name === this.addRecipe.name) {
          this.message = 'Công thức đã có trong bộ sưu tập'
          return
        }
      }
    }
    this.galleryObject._id = gallery
    this.galleryObject.recipe = this.childMessage
    console.log(this.galleryObject)
    this.galleryService.addGallery(this.galleryObject).subscribe(data => {
      if (data.body['status'] === 200) {
        let gallery = data.body['gallery']

        this.message = data.body['message']
        console.log(this.message)
        setTimeout(() => {
          const radio: HTMLElement = document.getElementById('close-modal');
          radio.click();
        }, 4000);

      }
    })
  }
  getPersonalGallery() {
    let email = this.cookie.get('email')

    if (email !== '') {
      this.galleryService.getGalleryies().subscribe(data => {
        console.log(data)
        if (data != null) {
          for (let gallery of data) {
            if (gallery.user.email === email) {
              if (gallery.recipe.length > 0) {
                gallery.image = gallery.recipe[0].imageUrl
              } else {
                gallery.image = 'fvt7rkr59r9d7wk8ndbd'
              }
              this.personalGallery.push(gallery)
            }
          }
        }
      })
    }
  }
}
