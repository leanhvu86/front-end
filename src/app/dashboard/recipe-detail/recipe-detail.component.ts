import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { RecipeService } from "src/app/shared/service/recipe-service.service";
import { Recipe } from "src/app/shared/model/recipe";
import { CookieService } from "ngx-cookie-service";
import { UserService } from "src/app/shared/service/user.service.";

import { Cloudinary } from "@cloudinary/angular-5.x";
import { FormGroup, FormBuilder } from '@angular/forms';
import { LoginServiceService } from 'src/app/shared/service/login-service.service';
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
  }
  isAuthenicate: boolean = false;
  showModal: boolean = false;
  isModeration: boolean = false;
  imageUrl: string = 'jbiajl3qqdzshdw0z749'
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

  constructor(
    private cloudinary: Cloudinary,
    private route: ActivatedRoute,
    private cookie: CookieService,
    private recipeService: RecipeService,
    private userService: UserService,
    private _loginService: LoginServiceService,
    private formBuilder: FormBuilder,
    private _router: Router,
  ) { }
  id: string;
  ngOnInit() {
    this.getRecipeDetail();
    this.registerForm = this.formBuilder.group({

      content: [''],
      image: [''],
      imageUrl: ['']
    });
    this.isModeration = this.cookie.get('role') !== '' ? true : false;
    this.isAuthenicate = this.cookie.get('email') !== "" ? true : false;
  }
  get f() { return this.registerForm.controls; }

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

        this.getRecipes()
      }
    });

  }
  loginUser() {
    console.log(this.userLogin.email + " user đăng nhập");
    this._loginService.loginAuth(this.userLogin).subscribe((data) => {
      this.errorMessage = null;
      if (data.body['status'] === 200) {
        this._loginService.updateAuthStatus(true);


        let user = data.body;
        let role;
        for (let key in user) {
          if (key === 'role') {
            role = user[key];
            console.log(role);
          }
          if (key === 'image') {
            this.imageUrl = user[key];
            console.log(this.imageUrl);
          }
          if (parseInt(role) === -1) {
            this.errorMessage = 'Bạn chưa xác thực email đã đăng ký';
            return;
          }
          if (key === 'user') {
            let users = user[key];
            console.log(users.token);
            this.cookie.set('token', users.token);
            this.cookie.set('isAuthenicate', '1');
          }
          if (key === 'role') {
            role = user[key];
            this.cookie.set('role', role);
            console.log(role)
            if (role !== undefined && role !== '') {
              this.isModeration = true
              console.log(role)
            }
          }
        }
        this.showModal = false;
        const radio: HTMLElement = document.getElementById('close-modal');
        radio.click();
        sessionStorage.setItem('user', this.userLogin.email);
        this.cookie.set('email', this.userLogin.email);
        this.isAuthenicate = true;
        console.log('true');
        console.log(this.recipe._id)
        window.location.reload();
      }
      if (data.body['status'] !== 200) {
        this.errorMessage = data.body['message'];
      }
      if (data.body['status'] === 404) {
        this.errorMessage = data.body['message'];
      }
    })
  }
  getRecipes() {
    console.log(this.recipe)
    this.recipeService.getRecipes().subscribe(recipeArray => {
      let arr: Recipe[] = [];
      for (let recip of recipeArray) {
        for (let cookCheck of this.recipe.cookWay) {
          let cookWayArr = recip.cookWay;
          for (let cokkway of cookWayArr) {
            if (cookCheck.cookWayCode === cokkway.cookWayCode && recip._id !== this.recipe._id) {
              arr.push(recip);
            }
          }
        }
      }
      this.recipes = arr.filter(function (item, pos) {
        return arr.indexOf(item) == pos;
      });

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
      const radio: HTMLElement = document.getElementById("modal-button1");
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
      const radio: HTMLElement = document.getElementById("modal-button1");
      radio.click();
      return;
    }
    console.log(recipe);
    this.like = true;

    console.log(recipe.user.email);
    let user = recipe.user;
    let interestObject = new Object({
      user: user,
      objectId: recipe,
      objectType: "2"
    });
    console.log(interestObject);
    this.recipeService.likeRecipe(interestObject).subscribe(data => {
      if (data !== undefined) {
        console.log(data);
        this.recipe = data.body["recipe"];
        console.log("success");
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
      const radio: HTMLElement = document.getElementById("modal-button1");
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
        console.log(data);
        this.recipe = data.body["recipe"];
        console.log("success");
      }
    });
  }
  addComment() {
    if (this.isAuthenicate == false) {
      const radio: HTMLElement = document.getElementById("modal-button1");
      radio.click();
      return;
    }
    console.log(this.registerForm.value)
    console.log(this.recipe);
    this.userObject = this.registerForm.value;
    this.done = true;
    let typeDone
    if (this.checkDone === true) {
      typeDone = 1
    } else {
      typeDone = 0
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
    if (this.userObject.content === null) {
      this.errorMessage = "Không để trống nội dung bình luận";
    }
    this.recipeService.addComment(doneObject).subscribe(data => {
      if (data !== undefined) {
        console.log(data);

        this.recipe = data.body["recipe"];
        console.log("success");
      }
    });
  }
  dislikeRecipe(recipe: any) {
    console.log(recipe);
    this.like = false;
    console.log(recipe.user.email);
    let user = recipe.user;
    let interestObject = new Object({
      user: user,
      objectId: recipe,
      objectType: "2"
    });
    console.log(recipe.user.email);
    console.log(interestObject);
    this.recipeService.dislikeRecipe(interestObject).subscribe(data => {
      if (data !== undefined) {
        console.log(data);
        this.recipe.totalPoint--;
        let userObject = new Object({
          email: user.email
        });
        this.userService.dislikeremovePoint(userObject).subscribe(data => {
          if (data.body["status"] === 200) {
            console.log("success");
          }
        });
      }
    });
  }
}
