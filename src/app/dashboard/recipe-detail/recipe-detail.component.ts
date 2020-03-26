import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { RecipeService } from "src/app/shared/service/recipe-service.service";
import { Recipe } from "src/app/shared/model/recipe";
import { CookieService } from "ngx-cookie-service";
import { UserService } from "src/app/shared/service/user.service.";

import { Cloudinary } from "@cloudinary/angular-5.x";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoginServiceService } from "src/app/shared/service/login-service.service";
import { Gallery } from 'src/app/shared/model/gallery';
import { GalleryService } from 'src/app/shared/service/gallery.service';
@Component({
  selector: "app-recipe-detail",
  templateUrl: "./recipe-detail.component.html",
  styleUrls: ["./recipe-detail.component.css"]
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  cookSteps: [] = [];
  userObject = {
    content: "",
    image: "",
    imageUrl: ""
  };
  userLogin = {
    email: "",
    password: ""
  };
  personalGallery: Gallery[] = []
  galleryObject = {
    _id: "",
    recipe: Recipe
  };
  interestObject = {
    user: '',
    objectId: Recipe,
    objectType: ''
  };
  totalPoint: number = 0
  doneCount: number = 0
  addRecipe = Recipe
  submitted = false;
  isAuthenicate: boolean = false;
  showModal: boolean = false;
  isModeration: boolean = false;
  imageUrl: string = "jbiajl3qqdzshdw0z749";
  recipes: Recipe[] = [];
  checkDone: boolean = false;
  registerForm: FormGroup;
  private hasBaseDropZoneOver1 = false;
  errorMessage: string = null;
  multiplyElement: number = 4;
  oldMultiplyElement: number;
  like: boolean = false;
  done: boolean = false;
  showImageStep: boolean = false;
  prepared: number;
  totalCookingTime: number;
  totalRecipe: number = 0
  constructor(
    private cloudinary: Cloudinary,
    private route: ActivatedRoute,
    private cookie: CookieService,
    private recipeService: RecipeService,
    private userService: UserService,
    private _loginService: LoginServiceService,
    private formBuilder: FormBuilder,
    private _router: Router,
    private galleryService: GalleryService
  ) { }
  id: string;
  ngOnInit() {
    this.getRecipeDetail();
    this.getPersonalGallery()
    this.registerForm = this.formBuilder.group({

      content: ["", Validators.required],
      image: [""],
      imageUrl: [""]
    });
    this.isModeration = this.cookie.get("role") !== "" ? true : false;
    this.isAuthenicate = this.cookie.get("email") !== "" ? true : false;
  }
  get f() {
    return this.registerForm.controls;
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
  getRecipeDetail() {
    this.id = this.route.snapshot.params.id;
    this.recipeService.getRecipeDetail(this.id).subscribe(data => {
      let recipeTem = data["recipe"];
      this.recipe = recipeTem;
      if (this.recipe !== undefined && this.recipe.ingredients.length > 0) {
        for (let ingredient of this.recipe.ingredients) {
          console.log(ingredient);
          let quantity =
            parseInt(ingredient.quantitative) * this.multiplyElement;
          ingredient.quantitative = quantity;
          this.oldMultiplyElement = this.multiplyElement;
        }
      }
      if (this.recipe !== undefined && this.recipe.cockStep.length > 0) {
        for (let ingredient of this.recipe.ingredients) {
          let quantity =
            parseInt(ingredient.quantitative) * this.multiplyElement;
          ingredient.quantitative = quantity;
          this.oldMultiplyElement = this.multiplyElement;
        }
        for (let cookStep of this.recipe.cockStep) {
          let arrayTemp = cookStep.image;
          cookStep.image = arrayTemp.split(",");
          cookStep.check = true;
        }
        if (this.recipe.hardLevel !== undefined) {
          if (this.recipe.hardLevel === "") {
            this.recipe.hardLevel = "Không xác định";
          } else if (this.recipe.hardLevel === "1") {
            this.recipe.hardLevel = "Dễ";
          } else if (this.recipe.hardLevel === "2") {
            this.recipe.hardLevel = "Trung bình";
          } else if (this.recipe.hardLevel === "3") {
            this.recipe.hardLevel = "Khó";
          } else if (this.recipe.hardLevel === "4") {
            this.recipe.hardLevel = "Rất khó";
          }
        }
        this.cookSteps = this.recipe.cockStep;

        this.getRecipes();
      }
    });
  }

  getRecipes() {
    console.log(this.recipe);
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
          this.totalRecipe++
        }
      }
      this.recipes = arr.filter(function (item, pos) {
        return arr.indexOf(item) == pos;
      });
      this.doneCount = this.recipe.doneCount
      this.totalPoint = this.recipe.totalPoint
      console.log(this.recipes);
    });
  }
  fileOverBase1(e: any): void {
    console.log(e);
    this.hasBaseDropZoneOver1 = e;
  }
  message = null;
  handleFiles(event: any, index: any) {
    const files = event.target.files;
    console.log(files);
    for (let i = 0; i < files.length; i++) {
      if (files.length > 5) {
        this.errorMessage = "Bạn chỉ có thể nhập 5 ảnh cho 1 bước!";
        const radio: HTMLElement = document.getElementById("modal-button");
        radio.click();
        return;
      }
      const id = "imageArray";
      const inputValue = (document.getElementById(id) as HTMLInputElement)
        .value;
      const arr = inputValue.split(",");
      console.log(" imageArray nè" + inputValue);
      if (arr.length > 5) {
        this.errorMessage = "Bạn chỉ có thể nhập 5 ảnh cho 1 bước !";
        const radio: HTMLElement = document.getElementById("modal-button");
        radio.click();
        return;
      }
      this.uploadFile(files[i]); // call the function to upload the file
    }
  }
  uploadFile(file: any) {
    if (this.isAuthenicate == false) {
      const radio: HTMLElement = document.getElementById("modal-button");
      radio.click();
      return;
    }
    let inputValue;
    console.log(file);
    const url = `https://api.cloudinary.com/v1_1/${
      this.cloudinary.config().cloud_name
      }/image/upload`;
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

    // Update progress (can be used to show progress indicator)
    xhr.upload.addEventListener("progress", function (e) {
      const progress = Math.round((e.loaded * 100.0) / e.total);
      // document.getElementById('progress').style.width = progress + "%";

      console.log(`fileuploadprogress data.loaded: ${e.loaded},
    data.total: ${e.total}`);
    });
    xhr.onreadystatechange = function (e) {
      if (xhr.readyState == 4 && xhr.status == 200) {
        // File uploaded successfully
        const response = JSON.parse(xhr.responseText);
        const url = response.secure_url;
        // Create a thumbnail of the uploaded image, with 150px width
        const tokens = url.split("/");
        tokens.splice(-2, 0, "w_90,h_90,c_scale");
        const img = new Image(); // HTML5 Constructor
        img.src = tokens.join("/");
        img.alt = response.public_id;

        const id = "imageArray";
        inputValue = (document.getElementById(id) as HTMLInputElement).value;
        img.id = id + "_";
        img.onclick = function () {
          // xử lí xóa ảnh khi click thì  phải xóa ở trong imageArray( xóa public_id của ảnh trên cloud)
          document.getElementById(galleryID).removeChild(img);

          const id = "imageArray";
          const inputValue = (document.getElementById(id) as HTMLInputElement)
            .value;
          console.log(inputValue);
          const arr = inputValue.split(",");
          console.log(arr);
          const id_tag = img.alt;
          const position = arr.indexOf(id_tag);

          if (~position) {
            arr.splice(position, 1);
          }

          // array = [2, 9]
          console.log(arr.toString());
          const radio = document.getElementById(id) as HTMLInputElement;
          radio.value = arr.toString();
        };
        inputValue = inputValue + response.public_id + ",";
        inputValue = inputValue.trim();
        console.log(inputValue);
        const radio = document.getElementById(id) as HTMLInputElement;
        radio.value = inputValue;

        console.log(radio.value);
        const galleryID = "gallery";
        document.getElementById(galleryID).appendChild(img);
      }
    };
    const tags = "myphotoalbum";
    fd.append("upload_preset", this.cloudinary.config().upload_preset);
    fd.append("tags", tags); // Optional - add tag for image admin in Cloudinary
    fd.append("file", file);
    file.withCredentials = false;
    xhr.send(fd);
  }

  countIngredient(multiplyElement: any) {
    console.log(this.multiplyElement);
    if (this.recipe !== undefined && this.recipe.ingredients.length > 0) {
      for (let ingredient of this.recipe.ingredients) {
        console.log(ingredient);
        let quantity =
          (parseInt(ingredient.quantitative) / this.oldMultiplyElement) *
          this.multiplyElement;
        ingredient.quantitative = quantity;
      }
      this.oldMultiplyElement = this.multiplyElement;
    }
  }
  video(link: any) {
    console.log(link);
    var url = "https://www.youtube.com/watch?v=" + link;
    window.open(url, "MsgWindow", "width=600,height=400");
  }
  fullImage() {
    var arrayNoimag = Array.from(
      document.getElementsByClassName("noImage") as HTMLCollectionOf<
        HTMLElement
      >
    );
    arrayNoimag.forEach(element => {
      console.log(element);
      element.style.height = "300px";
      element.style.minHeight = "400px";
    });
    var arrayNoimag = Array.from(
      document.getElementsByClassName("bigContent") as HTMLCollectionOf<
        HTMLElement
      >
    );
    arrayNoimag.forEach(element => {
      console.log(element);
      element.style.height = "300px";
      element.style.minHeight = "400px";
    });
    this.showImageStep = false;
    console.log(this.showImageStep);
  }
  icon = "highlight_off";

  public changeIcon(event: any, index: number) {
    console.log("click" + event);
    console.log("click" + index);
    const id = "icon" + index;
    const radio: HTMLElement = document.getElementById(id);

    if (radio.style.color === "lightgreen") {
      radio.style.color = "gray";
    } else {
      radio.style.color = "lightgreen";
    }
  }
  noImage() {
    var arrayNoimag = Array.from(
      document.getElementsByClassName("noImage") as HTMLCollectionOf<
        HTMLElement
      >
    );
    arrayNoimag.forEach(element => {
      console.log(element);
      element.style.height = "150px";
      element.style.minHeight = "150px";
    });
    var arrayNoimag = Array.from(
      document.getElementsByClassName("bigContent") as HTMLCollectionOf<
        HTMLElement
      >
    );
    arrayNoimag.forEach(element => {
      console.log(element);
      element.style.height = "150px";
      element.style.minHeight = "150px";
    });
    this.showImageStep = true;
    console.log(this.showImageStep);
  }
  likeRecipe(recipe: any) {
    if (this.isAuthenicate == false) {
      const radio: HTMLElement = document.getElementById("modal-button");
      radio.click();
      return;
    }
    console.log(recipe);
    this.like = true;

    console.log(recipe.user.email);
    let user = recipe.user;
    this.interestObject.user = recipe.user.email
    this.interestObject.objectId = recipe
    this.interestObject.objectType = '2'
    console.log(this.interestObject);
    this.recipeService.likeRecipe(this.interestObject).subscribe(data => {
      if (data !== undefined) {
        console.log(data);
        this.recipe = data.body["recipe"];
        console.log("success");
        this.totalPoint++
        let userObject = new Object({
          email: user.email
        });
        this.userService.likeAddPoint(userObject).subscribe(data => {
          if (data.body["status"] === 200) {
            console.log("success");
          }
        });
      }
    });
  }

  addDoneRecipe(recipe: any) {
    if (this.isAuthenicate == false) {
      const radio: HTMLElement = document.getElementById("modal-button");
      radio.click();
      return;
    }
    console.log(recipe);
    this.done = true;
    let user = this.cookie.get("email");
    let doneObject = new Object({
      user: user,
      recipe: recipe,
      type: 1,
      content: "",
      imageUrl: ""
    });
    console.log(doneObject);
    this.recipeService.addComment(doneObject).subscribe(data => {
      if (data !== undefined) {
        this.doneCount++
        console.log(data);
        this.recipe = data.body["recipe"];
        console.log("success");
      }
    });
  }
  addComment() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    if (this.isAuthenicate == false) {
      const radio: HTMLElement = document.getElementById("modal-button");
      radio.click();
      return;
    }
    console.log(this.registerForm.value);
    console.log(this.recipe);
    this.userObject = this.registerForm.value;
    this.done = true;
    let typeDone;
    if (this.checkDone === true) {
      typeDone = 1;
    } else {
      typeDone = 0;
    }
    let user = this.cookie.get("email");
    console.log(this.userObject);
    const inputValue = (document.getElementById(
      "imageArray"
    ) as HTMLInputElement).value;
    let doneObject = new Object({
      user: user,
      recipe: this.recipe,
      type: typeDone,
      content: this.userObject.content,
      imageUrl: inputValue
    });
    console.log(doneObject);

    this.recipeService.addComment(doneObject).subscribe(data => {
      if (data !== undefined) {
        console.log(data);

        this.recipe = data.body["recipe"];
        console.log("success");
      }
    });
  }
  dislikeRecipe(recipe: any) {
    if (this.isAuthenicate == false) {
      const radio: HTMLElement = document.getElementById("modal-button");
      radio.click();
      return;
    }
    this.like = false;
    let user = recipe.user;
    this.interestObject.user = recipe.user.email
    this.interestObject.objectId = recipe
    this.interestObject.objectType = '2'
    this.recipeService.dislikeRecipe(this.interestObject).subscribe(data => {
      if (data !== undefined) {
        this.recipe.totalPoint--
        let userObject = new Object({
          email: user.email
        });
        this.userService.dislikeremovePoint(userObject).subscribe(data => {
          if (data.body["status"] === 200) {
            console.log("success");
            this.totalPoint--
          }
        });
      }
    });
  }
  addBookmark(recipe: any) {

    this.message = ''
    if (this.isAuthenicate !== true) {
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      return;
    }
    console.log(recipe)
    this.addRecipe = recipe
    const radio: HTMLElement = document.getElementById('modal-button1');
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
    this.galleryObject.recipe = this.addRecipe
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
}
