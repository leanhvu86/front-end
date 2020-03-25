import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/shared/service/user.service.';
import { RecipeService } from 'src/app/shared/service/recipe-service.service';
import { GalleryService } from 'src/app/shared/service/gallery.service';
import { Recipe } from 'src/app/shared/model/recipe';
import { Gallery } from 'src/app/shared/model/gallery';
import { User } from 'src/app/shared/model/user';
@Component({
  selector: 'app-memberinfor',
  templateUrl: './memberinfor.component.html',
  styleUrls: ['./memberinfor.component.css']
})
export class MemberinforComponent implements OnInit {

  isAuthenicate: boolean = false;
  isLoad: boolean = false;
  viewCount: number = 0;
  recipeCount: number = 0;
  galleryCount: number = 0;
  doneCount: number = 0;
  memberRecipes: Recipe[] = []
  memberGallery: Gallery[] = []
  memberInfo: User
  imageUrl: String = 'jbiajl3qqdzshdw0z749'
  infoCheck: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private cookie: CookieService,
    private userService: UserService,
    private galleryService: GalleryService,
    private recipeService: RecipeService,
  ) {
    this.isAuthenicate = this.cookie.get("email") !== "" ? true : false;
  }
  id: string;
  ngOnInit() {

    this.getMemerInfo()
  }
  getMemerInfo() {
    this.id = this.route.snapshot.params.id;
    console.log(this.id)
    this.userService.getMemberInfo(this.id).subscribe(user => {
      if (user !== undefined) {
        if (user.imageUrl !== '') {
          this.imageUrl = user.imageUrl
        }
        this.recipeService.getRecipes().subscribe(recipes => {
          if (recipes !== undefined) {
            for (let recipe of recipes) {
              if (recipe.user._id === user._id) {
                console.log(recipe.user.name)
                this.recipeCount++
                this.doneCount = this.doneCount + recipe.doneCount
                this.viewCount = this.viewCount + recipe.viewCount
                this.memberRecipes.push(recipe)
              }
            }
          }
        })
        this.galleryService.getGalleryies().subscribe(gallerys => {
          if (gallerys !== undefined) {
            for (let gallery of gallerys) {
              if (gallery.user._id === user._id) {
                if (gallery.recipe.length > 0) {
                  gallery.image = gallery.recipe[0].imageUrl
                } else {
                  gallery.image = 'fvt7rkr59r9d7wk8ndbd'
                }
                this.memberGallery.push(gallery)
              }
            }
            this.galleryCount = this.memberGallery.length
          }
        })
        this.memberInfo = user
        this.infoCheck = true;
      }
    })
  }
}
