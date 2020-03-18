import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { RecipeService } from "src/app/shared/service/recipe-service.service";
import { Recipe } from "src/app/shared/model/recipe";
import { CookieService } from "ngx-cookie-service";
import { UserService } from "src/app/shared/service/user.service.";

import { Cloudinary } from "@cloudinary/angular-5.x";
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
    private userService: UserService
  ) {}
  id: string;
  ngOnInit() {
    this.getRecipeDetail();
  }
  getRecipeDetail() {
    console.log("recipe");
    this.id = this.route.snapshot.params.id;
    console.log(this.id);
    this.recipeService.getRecipeDetail(this.id).subscribe(data => {
      console.log(data["recipe"]);
      this.recipe;
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
          console.log(ingredient);
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
        console.log(this.cookSteps);
      }
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
    xhr.upload.addEventListener("progress", function(e) {
      const progress = Math.round((e.loaded * 100.0) / e.total);
      // document.getElementById('progress').style.width = progress + "%";

      console.log(`fileuploadprogress data.loaded: ${e.loaded},
    data.total: ${e.total}`);
    });
    xhr.onreadystatechange = function(e) {
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
        img.onclick = function() {
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
  // hàm này a tạo sáng nay để e tái sử dụng được.
  // luồng như sau nè
  // khi người dùng nhấn thực hiện thì mặc định sẽ tạo 1 bản ghi bình luôn với type =1  nghĩa là đã thực hiện
  // khi e tạo bình luận thì e phải tạo bản ghi với type =0 nghĩa là chưa thực hiện
  // nếu người dùng của em vừa bình luận vừa thực hiện thì a sẽ làm 1 hàm khác. hiện tại
  // hai ae cứ sử dụng chung hàm này đi. k có front end thì back end khó ra bug lắm thế nên a mới kêu e build haha
  // cái node js debug hơi khó. nên có những thứ cần thiết front end thì phải ra front end. cái thêm công thức
  // k có front end thì k debug nổi mà ra bug cơ nó có tận gần 20 properties.. 4 cái array haha thua
  // good luck
  // mà luồng
  addDoneRecipe(recipe: any) {
    console.log(recipe);
    this.done = true;
    let user = this.cookie.get("email");
    console.log(recipe);
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
    console.log(this.recipe);
    this.done = true;
    let user = this.cookie.get("email");
    console.log(this.userObject);
    const inputValue = (document.getElementById(
      "imageArray"
    ) as HTMLInputElement).value;
    let doneObject = new Object({
      user: user,
      recipe: this.recipe,
      type: 0,
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
