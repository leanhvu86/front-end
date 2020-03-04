import { Component, OnInit, NgZone, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, ValidatorFn, FormArray } from '@angular/forms';
import { ProvinceService } from 'src/app/shared/service/province.service';
import { Province } from 'src/app/shared/model/province';
import { Passenger } from 'src/app/shared/model/passenger';
import { FileUploader, FileUploaderOptions, ParsedResponseHeaders } from 'ng2-file-upload';
import { RxwebValidators } from "@rxweb/reactive-form-validators"
import { Country } from 'src/app/shared/model/country';
import { CountryService } from 'src/app/shared/service/country.service';
import { FoodType } from 'src/app/shared/model/foodType';
import { CookWay } from 'src/app/shared/model/cookWay';
import { Recipe } from 'src/app/shared/model/recipe';
import { RecipeService } from 'src/app/shared/service/recipe-service.service';
import { Router } from '@angular/router';
import { Cloudinary } from '@cloudinary/angular-5.x';
import { HttpClient } from '@angular/common/http';
import { Ingredient } from '../../shared/model/ingredient';
@Component({
  selector: 'app-register-passenger',
  templateUrl: './register-passenger.component.html',
  styleUrls: ['./register-passenger.component.css']
})

export class RegisterPassengerComponent implements OnInit {
  profileForm: FormGroup;
  cookStep: FormArray;
  ingredientsGroup: FormArray;
  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  public index: number = 0;
  public imageIndex: number = 0;
  public showVideoTutorial: boolean = false;
  public show: boolean = false;
  public showIngredient: boolean = false;
  public countrys: Country[] = [];
  public countryArray: Country[] = [];
  public foodTypes: FoodType[] = [];
  public foodTypesArray: FoodType[] = [];
  public cookWays: CookWay[] = [];
  public cookWayArray: CookWay[] = [];
  public message: string = '';
  checkIngredient: boolean = false;
  urlArray: Array<Array<String>>[] = [];
  submitted = false;
  @Input()
  responses: Array<any>;
  oldUrl: string = null;
  nowUrl: string = null;
  public ingredientArrays: Object[] = [];
  private hasBaseDropZoneOver: boolean = false;
  private hasBaseDropZoneOver1: boolean = false;
  private uploader: FileUploader;
  private title: string;
  constructor(private cloudinary: Cloudinary,
    private zone: NgZone, private http: HttpClient,
    private formbuilder: FormBuilder, private countryService: CountryService,
    private recipeService: RecipeService, private _router: Router
  ) {
    this.responses = [];
    this.title = '';
    this.profileForm = this.formbuilder.group({
      recipeName: ['', [Validators.minLength(5), Validators.maxLength(200), Validators.required]],
      content: ['', [Validators.minLength(20), Validators.maxLength(500), Validators.required]],
      videoLink: [''],
      hardLevel: ['1', Validators.required],
      time: ['', [Validators.min(5), Validators.required]],
      ingredientArray: ['']
      // ,
      // ingredientsGroup: this.formbuilder.array([this.addControlNgL() //add duplicate array Validator
      // ])
      ,
      cookStep: this.formbuilder.array([this.addControl()
        //add duplicate array Validator
      ])
    })
  }
  get f() { return this.profileForm.controls; }
  ngOnInit() {

    this.getCountrys();
    this.getFoodTypes();
    this.getCookWays();
    this.cookStep = this.profileForm.get('cookStep') as FormArray;
    // this.ingredientsGroup = this.profileForm.get('ingredientsGroup') as FormArray;
    // Create the file uploader, wire it to upload to your account
    const uploaderOptions: FileUploaderOptions = {
      url: `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/image/upload`,
      // Upload files automatically upon addition to upload queue
      autoUpload: true,
      // Use xhrTransport in favor of iframeTransport
      isHTML5: true,
      // Calculate progress independently for each uploaded file
      removeAfterUpload: true,
      // XHR request headers
      headers: [
        {
          name: 'X-Requested-With',
          value: 'XMLHttpRequest'
        }
      ]
    };
    this.uploader = new FileUploader(uploaderOptions);

    this.uploader.onBuildItemForm = (fileItem: any, form: FormData): any => {
      // Add Cloudinary's unsigned upload preset to the upload form
      form.append('upload_preset', this.cloudinary.config().upload_preset);
      // Add built-in and custom tags for displaying the uploaded photo in the list
      let tags = 'myphotoalbum';
      if (this.title) {
        form.append('context', `photo=${this.title}`);
        tags = `myphotoalbum,${this.title}`;
      }
      // Upload to a custom folder
      // Note that by default, when uploading via the API, folders are not automatically created in your Media Library.
      // In order to automatically create the folders based on the API requests,
      // please go to your account upload settings and set the 'Auto-create folders' option to enabled.


      //form.append('folder', 'angular_sample');
      // Add custom tags
      form.append('tags', tags);
      // Add file to upload
      form.append('file', fileItem);

      // Use default "withCredentials" value for CORS requests
      fileItem.withCredentials = false;
      return { fileItem, form };
    };

    // Insert or update an entry in the responses array
    const upsertResponse = fileItem => {
      // Run the update in a custom zone since for some reason change detection isn't performed
      // as part of the XHR request to upload the files.
      // Running in a custom zone forces change detection
      this.zone.run(() => {
        // Update an existing entry if it's upload hasn't completed yet

        // Find the id of an existing item
        const existingId = this.responses.reduce((prev, current, index) => {
          if (current.file.name === fileItem.file.name && !current.status) {
            return index;
          }
          return prev;
        }, -1);
        if (existingId > -1) {
          // Update existing item with new data
          this.responses[existingId] = Object.assign(this.responses[existingId], fileItem);
          if (this.responses[0].data.url != undefined && this.responses[0].data.url !== '') {

            this.oldUrl = this.nowUrl;
            this.nowUrl = this.responses[0].data.public_id;
            console.log(this.responses[0].data.public_id);
            if (this.oldUrl != null && this.oldUrl != '') {
              console.log(this.oldUrl);
              console.log(this.nowUrl);

            }
          }
          this.previewUrl = this.responses[0].data.public_id;
        } else {
          // Create new response
          this.responses.push(fileItem);
        }
      });
    };

    // Update model on completion of uploading a file
    this.uploader.onCompleteItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) =>
      upsertResponse(
        {
          file: item.file,
          status,
          data: JSON.parse(response)
        }
      );

    // Update model on upload progress event
    this.uploader.onProgressItem = (fileItem: any, progress: any) =>
      upsertResponse(
        {
          file: fileItem.file,
          progress,
          data: {}
        }
      );
  }

  updateTitle(value: string) {
    this.title = value;
  }

  // Delete an uploaded image
  // Requires setting "Return delete token" to "Yes" in your upload preset configuration
  // See also https://support.cloudinary.com/hc/en-us/articles/202521132-How-to-delete-an-image-from-the-client-side-
  deleteImage = function (data: any, index: number) {
    const url = `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/delete_by_token`;
    const headers = new Headers({ 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' });
    const options = { headers: headers };
    const body = {
      token: data.delete_token
    };
    this.http.post(url, body, options).subscribe(response => {
      console.log(`Deleted image - ${data.public_id} ${response.result}`);
      // Remove deleted item for responses
      this.responses.splice(index, 1);
    });
  };
  uploadFile(file: any, index: any) {

    console.log(file);
    console.log(index);
    var url = `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/image/upload`;
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');


    // Update progress (can be used to show progress indicator)
    xhr.upload.addEventListener("progress", function (e) {
      var progress = Math.round((e.loaded * 100.0) / e.total);
      //document.getElementById('progress').style.width = progress + "%";

      console.log(`fileuploadprogress data.loaded: ${e.loaded},
    data.total: ${e.total}`);
    });
    let imageIndex1 = this.imageIndex;
    xhr.onreadystatechange = function (e) {
      if (xhr.readyState == 4 && xhr.status == 200) {
        // File uploaded successfully
        var response = JSON.parse(xhr.responseText);
        var url = response.secure_url;
        // Create a thumbnail of the uploaded image, with 150px width
        var tokens = url.split('/');
        tokens.splice(-2, 0, 'w_90,h_90,c_scale');
        var img = new Image(); // HTML5 Constructor
        img.src = tokens.join('/');
        img.alt = response.public_id;


        let id = 'imageArray' + index;
        var inputValue = (<HTMLInputElement>document.getElementById(id)).value;
        img.id = id + '_' + imageIndex1;
        img.onclick = function () {
          document.getElementById(galleryID).removeChild(img);
          let id = 'imageArray' + index;
          var inputValue = (<HTMLInputElement>document.getElementById(id)).value;
          console.log(inputValue);
          let arr = inputValue.split(',');
          console.log(arr);
          let id_tag = img.alt;
          let position = arr.indexOf(id_tag);

          if (~position) arr.splice(position, 1);

          // array = [2, 9]
          console.log(arr.toString());
          const radio = (<HTMLInputElement>document.getElementById(id));
          radio.value = arr.toString();
        };
        img.alt = 'Bạn muốn xóa ảnh?';
        inputValue = inputValue + response.public_id + ',';
        inputValue = inputValue.trim();
        console.log(inputValue);
        const radio = (<HTMLInputElement>document.getElementById(id));
        radio.value = inputValue;
        console.log(radio.value);
        let galleryID = 'gallery' + index;
        document.getElementById(galleryID).appendChild(img);
      }
    };
    let tags = 'myphotoalbum';
    fd.append('upload_preset', this.cloudinary.config().upload_preset);
    fd.append('tags', tags); // Optional - add tag for image admin in Cloudinary
    fd.append('file', file);
    file.withCredentials = false;
    xhr.send(fd);
    this.imageIndex++;
  }
  handleFiles(event: any, index: any) {


    let files = event.target.files;
    console.log(files)
    for (let i = 0; i < files.length; i++) {
      if (files.length > 5) {
        this.message = 'Bạn chỉ có thể nhập 5 ảnh cho 1 bước!';
        const radio: HTMLElement = document.getElementById('modal-button');
        radio.click();
        return;
      }
      let id = 'imageArray' + index;
      var inputValue = (<HTMLInputElement>document.getElementById(id)).value;
      let arr = inputValue.split(',');
      console.log(' imageArray nè' + inputValue);
      if (arr.length > 5) {
        this.message = 'Bạn chỉ có thể nhập 5 ảnh cho 1 bước !';
        const radio: HTMLElement = document.getElementById('modal-button');
        radio.click();
        return;
      }
      this.uploadFile(files[i], index); // call the function to upload the file
    }
  };
  fileOverBase(e: any): void {
    console.log(e);
    this.hasBaseDropZoneOver = e;
  }
  fileOverBase1(e: any): void {
    console.log(e);
    this.hasBaseDropZoneOver1 = e;
  }
  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    console.log(this.fileData);
    this.preview();
  }

  preview() {
    // Show preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    }
  }

  updateProfile() {
    this.profileForm.patchValue({
      firstName: 'affff',
      contact: {
        mobileNo: '99898981'
      }
    })
    console.warn(this.profileForm.value);
  }
  onSubmit() {
    this.submitted = true;
    console.log('submit')
    console.log(this.nowUrl);
    if (this.nowUrl === null || this.nowUrl === '') {
      console.log(this.nowUrl);
      this.message = 'Vui lòng up ảnh hiển thị cho công thức';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      return;
    }
    // chưa validate
    if (this.profileForm.invalid) {
      return;
    }
    if (this.profileForm.value.cookStep[0].psnote == '') {
      this.message = 'Vui lòng điền hướng dẫn cho công thức';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      return;
    } else if (this.profileForm.value.cookStep[0].psnote.length < 10) {
      this.message = 'Hướng dẫn cho công thức có độ dài lớn hơn 10 ký tự';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      return;
    }
    else if (this.profileForm.value.cookStep[0].psnote.length > 500) {
      this.message = 'Hướng dẫn cho công thức có độ dài nhỏ hơn 500 ký tự';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      return;
    }
    if (this.cookWayArray.length === 0 || this.countryArray.length === 0 || this.foodTypesArray.length === 0) {
      this.message = 'Vui lòng phân loại cho công thức';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      return;
    }

    this.message === '';
    let recipe: Recipe = this.profileForm.value;
    //recipe.ingredientArray = this.getingredientArray(recipe.ingredients);
    console.log(recipe.time);
    if (parseInt(recipe.time) < 0) {
      this.message = 'Thời gian thực hiện phải lớn hơn 0';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      return;
    }
    recipe.country = this.countryArray;
    recipe.foodType = this.foodTypesArray;
    recipe.cookWay = this.cookWayArray;
    recipe.imageUrl = this.nowUrl;
    if (recipe.imageUrl === undefined || recipe.imageUrl === '') {
      console.log(recipe.imageUrl);
      this.message = 'Vui lòng up ảnh hiển thị cho công thức';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      return;
    }
    console.log(recipe);

    if (this.ingredientArrays === undefined || this.ingredientArrays.length == 0) {
      this.message = 'Bạn chưa nhập nguyên liệu của công thức';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      return;
    }
    recipe.ingredients = this.ingredientArrays;
    console.log(this.ingredientArrays);
    this.recipeService.registerRecipe(recipe).subscribe((data) => {
      const result = data.body
      if (result['status'] === 200) {
        this.message = result['message'];
        const radio: HTMLElement = document.getElementById('modal-button');
        radio.click();
        setTimeout(() => {
          this.finish();
        }, 2000);
      } else {
        this.message = result['message'];
        const radio: HTMLElement = document.getElementById('modal-button');
        radio.click();
      }
    });
  }


  finish() {
    const radio: HTMLElement = document.getElementById('index-home-link');
    radio.click();
    console.log('finish');
    this._router.navigate(['/index']);
  }
  getcookStep() {
    return this.profileForm.get('cookStep') as FormArray;
  }
  getInput() {
    return this.profileForm.get('ingredientsGroup') as FormArray;
  }

  addInputs(key) {
    //if duplicate array Validator  Validates as false then add row otherwise error

    if (key === 'cookStep') {
      // if no duplicate text then
      this.cookStep.push(this.addControl());
    } else if (key === 'ingredientsGroup') {
      // if no duplicate text then
      console.log('input');
      this.ingredientsGroup.push(this.addControlNgL())
    }
  }

  deleteAlias(pos) {
    this.index--;
    console.log(this.index);
    this.cookStep.removeAt(pos);
  }

  deleteInputs(pos) {
    this.ingredientsGroup.removeAt(pos);
  }
  addControl() {
    this.index++;
    let id = this.index;
    console.log(this.index);
    return this.formbuilder.group({
      index: this.formbuilder.control(id, RxwebValidators.unique()),
      name: this.formbuilder.control('', RxwebValidators.unique()),
      time: this.formbuilder.control(''),
      psnote: this.formbuilder.control('', RxwebValidators.unique()),
      check: this.formbuilder.control(''),
      image: this.formbuilder.control(''),
      imageArray: this.formbuilder.control('')
    });
  }
  addControlNgL() {
    console.log('input');
    return this.formbuilder.group({
      nameNL: this.formbuilder.control('', RxwebValidators.unique()),
      ratioq: this.formbuilder.control('', RxwebValidators.unique())
    });
  }
  onChangeofOptions(value: any) {
    if (this.show === false) {
      this.show = true;
      this.addControlNgL();
      console.log('add');
    } else {
      this.show = false;
      console.log('remove');
      this.clearFormArray(this.ingredientsGroup);

    }

  }
  runScript(e) {
    //See notes about 'which' and 'key'
    let ingredientString = e.target.value;
    ingredientString = ingredientString.trim();
    if (ingredientString.length > 1) {
      let arrayTest = ingredientString.split(';');
      let j = arrayTest.length;
      if (j > 0) {
        for (let i = 0; i < j; i++) {
          console.log(i)
          let arrTest = arrayTest[i];;
          arrTest = arrTest.trim();
          let arrtemp = arrTest;
          arrTest = arrTest.split(' ');
          console.log(arrayTest)
          console.log(arrTest)
          if (arrTest.length < 1) {
            this.message = 'Vui lòng nhập lại nguyên liệu cho công thức đúng định dạng';
            const radio: HTMLElement = document.getElementById('modal-button');
            radio.click();
            return;
          }
          let quantity = arrTest[0];
          quantity = quantity.trim()
          let checkQuan = this.checkQuantity(quantity);
          if (!checkQuan) {
            this.message = 'Vui lòng nhập lại số lượng cho nguyên liệu đúng định dạng';
            const radio: HTMLElement = document.getElementById('modal-button');
            radio.click();
            return;
          }
          console.log(quantity)
          let not = '';
          let typeOfqu = arrTest[1];
          let ingredientNam;
          if (arrTest.length > 2)
            ingredientNam = arrTest[2];
          if (arrTest.length > 3) {
            let notePoisition = arrtemp.indexOf(ingredientNam);
            if (notePoisition !== undefined && notePoisition > 0) {
              not = arrtemp.slice(notePoisition, arrtemp.length);
            }
          };
          if (arrTest.length >= 2) {

            let ingredient = new Object({

              quantitative: quantity,
              typeOfquantitative: typeOfqu,
              ingredientName: ingredientNam,
              note: not
            })
            // this.ingredientArrays['ingerdient'].push(this.ingredient)
            this.recipeService.createIngredient(ingredient).subscribe((data) => {
              const result = data.body
              console.log(data);
              if (result != undefined) {
                let tmessage = result['message'];
                console.log(tmessage);
                this.ingredientArrays.push(result);

                const radio = (<HTMLInputElement>document.getElementById('ingredientArraye'));
                radio.value = '';
                console.log(this.ingredientArrays);
              } else {
                let tmessage = result['message'];
                console.log(tmessage);
              }
            });
          }
        }
      }
    }
    // console.log(this.ingredientArrays)
  }
  deleteIngredient(ingredient: any, index: any) {
    console.log(ingredient);
    console.log(index)
    this.recipeService.deleteIngredient(ingredient).subscribe((data) => {
      const result = data.body
      console.log(data);
      if (result != undefined) {
        let tmessage = result['message'];
        console.log(tmessage);
        this.ingredientArrays.splice(index, 1);
      } else {
        let tmessage = result['message'];
        console.log(tmessage);
      }
    });
  }
  checkQuantity(str: any) {
    console.log(str)
    if (str === '') return false;
    try {
      let check = !isNaN(Number(str));
      if (check === true) {
        console.log(check)
        return true;
      }
      return false;
    } catch (error) {
      let patt = new RegExp("[0-9][/][0-9]");
      let res = patt.exec(str);
      console.log(res)
      if (res !== null) {
        return true;
      } else
        return false;
    }


  }
  onSearchChange(searchValue: Element): void {

    let id: string = 'radio' + searchValue;
    console.log(id);
    const radio: HTMLElement = document.getElementById(id);
    radio.click();


  }
  detectFiles(event) {
    let url;
    //url = this.urlArray[index];
    let files = event.target.files;
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          url.push(e.target.result);
          // let id = 'imageArray' + index;
          // let multipleUrl: string;
          // console.log(id);

          // var inputValue = (<HTMLInputElement>document.getElementById(id)).value;
          // if (inputValue !== '') {

          //   multipleUrl = inputValue + ',' + file.name;
          // } else {
          //   multipleUrl = file.name;
          // }
          // const radio = (<HTMLInputElement>document.getElementById(id));
          // radio.value = multipleUrl;
          // console.log(inputValue);
          // console.log(multipleUrl);

          // this.urlArray[index] = url;
        }
        reader.readAsDataURL(file);
        console.log(file);
      }
    }
  }
  onChangeofvideo(value: any) {
    if (this.showVideoTutorial === false) {
      this.showVideoTutorial = true;
      console.log('add');
    } else {
      this.showVideoTutorial = false;
      console.log('remove');

    }

  }
  onChangeofingredient(value: any) {
    if (this.showIngredient === false) {
      this.showIngredient = true;
      console.log('add');
    } else {
      this.showIngredient = false;
      console.log('remove');

    }

  }
  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }

  getCountrys() {
    this.countryService.getCountrys().subscribe(countrys => {
      this.countrys = countrys;
      console.log('countrys' + this.countrys);

    });
  }
  getFoodTypes() {
    this.countryService.getFoodTypes().subscribe(foodTypes => {
      this.foodTypes = foodTypes;
      console.log('foodType' + this.foodTypes);
    });
  }
  getCookWays() {
    this.countryService.getCookWays().subscribe(cookWay => {
      this.cookWays = cookWay;
      console.log('cookWay' + this.cookWays);
    });
  }
  getCheckboxValues(ev, data) {
    console.log(data);
    console.log(ev);
    let country = new Country();
    country.countryCode = data.countryCode;
    country.countryName = data.countryName;
    if (ev.target.checked) {
      // Pushing the object into array
      this.countryArray.push(country);

    } else {
      let removeIndex = this.countryArray.findIndex(itm => itm.countryCode === data.countryCode);

      if (removeIndex !== -1) {
        this.countryArray.splice(removeIndex, 1);
      }
    }


    //Duplicates the obj if we uncheck it
    //How to remove the value from array if we uncheck it
    console.log(this.countryArray);
  }
  getCheckboxValuesFoodType(ev, data) {
    console.log(data);
    console.log(ev);
    let foodType = new FoodType();
    foodType.foodTypeCode = data.foodTypeCode;
    foodType.foodTypeName = data.foodTypeName;
    if (ev.target.checked) {
      // Pushing the object into array
      this.foodTypesArray.push(foodType);

    } else {
      let removeIndex = this.foodTypesArray.findIndex(itm => itm.foodTypeCode === data.foodTypeCode);

      if (removeIndex !== -1) {
        this.foodTypesArray.splice(removeIndex, 1);
      }
    }


    //Duplicates the obj if we uncheck it
    //How to remove the value from array if we uncheck it
    console.log(this.foodTypesArray);
  }
  getCheckboxValuesCookWay(ev, data) {
    console.log(data);
    console.log(ev);
    let cookWay = new CookWay();
    cookWay.cookWayCode = data.cookWayCode;
    cookWay.cookWayName = data.cookWayName;
    if (ev.target.checked) {
      // Pushing the object into array
      console.log(cookWay)
      this.cookWayArray.push(cookWay);

    } else {
      let removeIndex = this.cookWayArray.findIndex(itm => itm.cookWayCode === data.cookWayCode);

      if (removeIndex !== -1) {
        this.cookWayArray.splice(removeIndex, 1);
      }
    }


    //Duplicates the obj if we uncheck it
    //How to remove the value from array if we uncheck it
    console.log(this.cookWayArray);
  }
}
interface Object {
  [key: string]: any
}
