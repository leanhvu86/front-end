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
  userObject = {
    email: "",
    password: ""
  }
  constructor(
    private route: ActivatedRoute,
    private cookie: CookieService,
    private userService: UserService,
    private galleryService: GalleryService,
    private recipeService: RecipeService,
  ) {
    this.isAuthenicate = this.cookie.get("email") !== "" ? true : false;
    console.log(this.isAuthenicate)
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
            this.userObject.email = this.cookie.get('email')
            if (this.userObject.email !== undefined || this.userObject.email !== '') {
              this.recipeService.findInterest(this.userObject).subscribe(data => {
                let interests = data.body['interests']



                for (let recipe of recipes) {
                  if (recipe.user._id === user._id) {
                    recipe.like = false
                    if (recipe.hardLevel !== undefined) {
                      if (recipe.hardLevel === "") {
                        recipe.hardLevel = "Không xác định";
                      } else if (recipe.hardLevel === "1") {
                        recipe.hardLevel = "Dễ";
                      } else if (recipe.hardLevel === "2") {
                        recipe.hardLevel = "Trung bình";
                      } else if (recipe.hardLevel === "3") {
                        recipe.hardLevel = "Khó";
                      } else if (recipe.hardLevel === "4") {
                        recipe.hardLevel = "Rất khó";
                      }
                    }
                    console.log(recipe.user.name)
                    this.recipeCount++
                    this.doneCount = this.doneCount + recipe.doneCount
                    this.viewCount = this.viewCount + recipe.viewCount
                    recipe.like = false
                    this.memberRecipes.push(recipe)

                    if (interests !== undefined) {
                      for (let interest of interests) {
                        if (interest.objectId._id === recipe._id && interest.objectType === '2') {
                          recipe.like = true
                        }
                      }
                    }
                  }
                }

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
                      if (interests !== undefined) {
                        for (let interest of interests) {
                          if (interest.objectId._id === gallery._id && interest.objectType === '1') {
                            gallery.like = true
                          }
                        }
                      }
                    }
                    this.galleryCount = this.memberGallery.length
                  }
                })
                this.memberInfo = user
                this.infoCheck = true;
              })
            }
          }
        })

      }
    })
  }
  likeGallerry(gallery: any, index: any) {

    console.log(gallery);
    console.log(index);
    if (this.isAuthenicate === false) {
      console.log('false');
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      return;
    }
    gallery.like = true;
    console.log(gallery.user.email)
    let user = this.cookie.get('email');
    let interestObject = new Object({
      user: user,
      objectId: gallery,
      objectType: '1'
    })
    let id = 'heartGallery' + index;
    const radio: HTMLElement = document.getElementById(id);
    radio.style.color = 'red';
    radio.style.opacity = '0.8';
    console.log(interestObject)
    this.recipeService.likeRecipe(interestObject).subscribe((data) => {
      if (data !== undefined) {
        console.log('success')
        let userObject = new Object({
          email: gallery.user.email
        })
        this.userService.likeAddPoint(userObject).subscribe((data) => {
          if (data.body['status'] === 200) {
            console.log('success')

          }
        });
      }
    });
    console.log(gallery.like);
  }

  nolikeGallery(gallery: any, index: any) {
    gallery.like = false;
    console.log(gallery);
    console.log(index);
    if (this.isAuthenicate !== true) {
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      return;
    }
    gallery.like = false;
    console.log(gallery.user.email)
    let user = this.cookie.get('email');
    let interestObject = new Object({
      user: user,
      objectId: gallery,
      objectType: '1'
    })
    let id = 'heartGallery' + index;
    const radio: HTMLElement = document.getElementById(id);
    radio.style.color = 'grey';
    radio.style.opacity = '0.5';
    console.log(gallery.user.email)
    console.log(interestObject)
    this.recipeService.dislikeRecipe(interestObject).subscribe((data) => {
      if (data !== undefined) {
        let userObject = new Object({
          email: gallery.user.email
        })
        this.userService.dislikeremovePoint(userObject).subscribe((data) => {
          if (data.body['status'] === 200) {
            console.log('success')

          }
        });
      }


    })
    console.log(gallery.like);
  }
  likeRecipe(recipe: any, index: any) {
    console.log(recipe);
    console.log(index);
    this.isAuthenicate = this.cookie.get('email') !== "" ? true : false;
    if (this.isAuthenicate === false) {
      console.log('false');
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      return;
    }
    recipe.like = true;
    console.log(recipe.user.email)
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
    console.log(recipe.like);
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
