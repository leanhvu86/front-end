import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/model/user';
import { Recipe } from 'src/app/shared/model/recipe';
import { LoginServiceService } from 'src/app/shared/service/login-service.service';
import { CookieService } from 'ngx-cookie-service';
import { RecipeService } from 'src/app/shared/service/recipe-service.service';
import { Options } from 'ng5-slider';
import { GalleryService } from 'src/app/shared/service/gallery.service';
import { Gallery } from 'src/app/shared/model/gallery';

@Component({
  selector: 'app-mygallery',
  templateUrl: './mygallery.component.html',
  styleUrls: ['./mygallery.component.css']
})
export class MygalleryComponent implements OnInit {
  id: String = '1'
  value: number = 2;
  options: Options = {
    floor: 0,
    ceil: 4,
    showOuterSelectionBars: true,
    showTicksValues: false
  };

  userObject = {
    email: "",
    password: ""
  }
  myGallery: Gallery[] = []
  user: User
  loadPage: boolean = false
  constructor(
    private _loginService: LoginServiceService,
    private cookie: CookieService,
    private gallerrService: GalleryService
  ) { }

  ngOnInit() {
    this.getUserInfo()
  }
  addNewGallery() {
    const radio: HTMLElement = document.getElementById('modal-button33');
    radio.click();
  }
  getUserInfo() {
    let email = this.cookie.get('email');
    if (email !== '') {
      this._loginService.testEmail(email).subscribe(data => {


        let user = data.body['user'];
        if (user !== undefined) {
          this.userObject.email = user.email
          this.gallerrService.findGallery(this.userObject).subscribe(data => {
            this.myGallery = data.body['gallerys']
            for (let gallery of this.myGallery) {
              if (gallery.recipe.length > 0) {
                gallery.image = gallery.recipe[0].imageUrl
              } else {
                console.log(gallery.recipe.length)
                gallery.image = 'fvt7rkr59r9d7wk8ndbd'
              }
            }
            this.user = user
            this.id = user._id
            console.log(this.id)
            this.loadPage = true
            if (user.totalPoint > 600) {
              this.value = 4
              user.level = 'Mastee'
            } else if (user.totalPoint > 400) {
              this.value = 3
              user.level = 'Cheffe'
            } else if (user.totalPoint > 250) {
              this.value = 2
              user.level = 'Cookee'
            } else if (user.totalPoint > 100) {
              this.value = 1
              user.level = 'Tastee'
            } else {
              this.value = 0
              user.level = 'Newbee'
            }
          })
        }
      })
    }
  }
}
