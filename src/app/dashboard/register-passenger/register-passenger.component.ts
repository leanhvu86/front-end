import { Component, Input, NgZone, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploader, FileUploaderOptions, ParsedResponseHeaders } from 'ng2-file-upload';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { Country } from 'src/app/shared/model/country';
import { CountryService } from 'src/app/shared/service/country.service';
import { FoodType } from 'src/app/shared/model/foodType';
import { CookWay } from 'src/app/shared/model/cookWay';
import { Recipe } from 'src/app/shared/model/recipe';
import { RecipeService } from 'src/app/shared/service/recipe-service.service';
import { Router } from '@angular/router';
import { Cloudinary } from '@cloudinary/angular-5.x';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { CookStepService } from '../../shared/service/cook-step.service';

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
  public index = 0;
  public imageIndex = 0;
  public showVideoTutorial = false;
  public show = false;
  public showIngredient = false;
  public countrys: Country[] = [];
  public countryArray: Country[] = [];
  public foodTypes: FoodType[] = [];
  public foodTypesArray: FoodType[] = [];
  public cookWays: CookWay[] = [];
  public cookWayArray: CookWay[] = [];
  public message = '';
  saving = false;
  checkIngredient = false;
  urlArray: Array<Array<String>>[] = [];
  submitted = false;
  @Input()
  responses: Array<any>;
  oldUrl: string = null;
  nowUrl: string = null;
  imageArrays: {};
  ingredientArrays: Object[] = [];
  hasBaseDropZoneOver = false;
  hasBaseDropZoneOver1 = false;
  uploader: FileUploader;
  title: string;
  hardLevelCheck: false;
  timeCheck: false;
  successMessage = '';
  constructor(private cloudinary: Cloudinary,
    private zone: NgZone, private http: HttpClient,
    private formbuilder: FormBuilder, private countryService: CountryService, private cookStepService: CookStepService,
    private recipeService: RecipeService, private _router: Router, private cookie: CookieService
  ) {
    this.responses = [];
    this.title = '';
    this.profileForm = this.formbuilder.group({
      recipeName: ['', [Validators.minLength(5), Validators.maxLength(200), Validators.required]],
      content: ['', [Validators.minLength(20), Validators.maxLength(500), Validators.required]],
      videoLink: [''],
      hardLevel: ['', Validators.required],
      time: ['', [Validators.min(5), Validators.required]],
      ingredientArray: ['']
      // ,
      // ingredientsGroup: this.formbuilder.array([this.addControlNgL() //add duplicate array Validator
      // ])
      ,
      cookStep: this.formbuilder.array([this.addControl()
        // add duplicate array Validator
      ])
    });
  }

  get f() {
    return this.profileForm.controls;
  }

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
      if (fileItem.size > 600000) {
        alert('Kích thước file ảnh phải bé hơn 600 kB')
        return
      }
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


      // form.append('folder', 'angular_sample');
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
          this.previewUrl = this.responses[0].data.public_id;
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
    const options = { headers };
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
    let inputValue;
    console.log(file);
    console.log(index);
    const url = `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/image/upload`;
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');


    // Update progress (can be used to show progress indicator)
    xhr.upload.addEventListener('progress', function (e) {
      const progress = Math.round((e.loaded * 100.0) / e.total);
      // document.getElementById('progress').style.width = progress + "%";

      console.log(`fileuploadprogress data.loaded: ${e.loaded},
    data.total: ${e.total}`);
    });
    const imageIndex1 = this.imageIndex;
    xhr.onreadystatechange = function (e) {
      if (xhr.readyState == 4 && xhr.status == 200) {
        // File uploaded successfully
        const response = JSON.parse(xhr.responseText);
        const url = response.secure_url;
        // Create a thumbnail of the uploaded image, with 150px width
        const tokens = url.split('/');
        tokens.splice(-2, 0, 'w_90,h_90,c_scale');
        const img = new Image(); // HTML5 Constructor
        img.src = tokens.join('/');
        img.alt = response.public_id;


        const id = 'imageArray' + index;
        inputValue = (document.getElementById(id) as HTMLInputElement).value;
        img.id = id + '_' + imageIndex1;
        img.onclick = function () {
          document.getElementById(galleryID).removeChild(img);
          const id = 'imageArray' + index;
          const inputValue = (document.getElementById(id) as HTMLInputElement).value;
          console.log(inputValue);
          const arr = inputValue.split(',');
          console.log(arr);
          const id_tag = img.alt;
          const position = arr.indexOf(id_tag);

          if (~position) {
            arr.splice(position, 1);
          }

          // array = [2, 9]
          console.log(arr.toString());
          const radio = (document.getElementById(id) as HTMLInputElement);
          radio.value = arr.toString();
        };
        inputValue = inputValue + response.public_id + ',';
        inputValue = inputValue.trim();
        console.log(inputValue);
        const radio = (document.getElementById(id) as HTMLInputElement);
        radio.value = inputValue;

        console.log(radio.value);
        const galleryID = 'gallery' + index;
        document.getElementById(galleryID).appendChild(img);
      }

    };
    const tags = 'myphotoalbum';
    fd.append('upload_preset', this.cloudinary.config().upload_preset);
    fd.append('tags', tags); // Optional - add tag for image admin in Cloudinary
    fd.append('file', file);
    file.withCredentials = false;
    xhr.send(fd);
    this.imageIndex++;
  }

  handleFiles(event: any, index: any) {


    const files = event.target.files;
    console.log(files);
    for (let i = 0; i < files.length; i++) {
      if (files.length > 5) {
        this.message = 'Bạn chỉ có thể nhập 5 ảnh cho 1 bước!';
        const radio: HTMLElement = document.getElementById('modal-button');
        radio.click();
        return;
      }
      const id = 'imageArray' + index;
      const inputValue = (document.getElementById(id) as HTMLInputElement).value;
      const arr = inputValue.split(',');
      console.log(' imageArray nè' + inputValue);
      if (arr.length > 5) {
        this.message = 'Bạn chỉ có thể nhập 5 ảnh cho 1 bước !';
        const radio: HTMLElement = document.getElementById('modal-button');
        radio.click();
        return;
      }
      this.uploadFile(files[i], index); // call the function to upload the file
    }
  }

  fileOverBase(e: any): void {
    console.log(e);
    this.hasBaseDropZoneOver = e;
  }

  fileOverBase1(e: any): void {
    console.log(e);
    this.hasBaseDropZoneOver1 = e;
  }

  fileProgress(fileInput: any) {
    this.fileData = fileInput.target.files[0] as File;
    console.log(this.fileData);
    this.preview();
  }

  preview() {
    // Show preview
    const mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    };
  }

  updateProfile() {
    this.profileForm.patchValue({
      firstName: 'affff',
      contact: {
        mobileNo: '99898981'
      }
    });
    console.warn(this.profileForm.value);
  }

  onSubmit() {
    if (this.saving === true) {
      return;
    }
    this.submitted = true;
    console.log('submit');
    console.log(this.nowUrl);
    if (this.nowUrl === null || this.nowUrl === '') {
      console.log(this.nowUrl);
      this.message = 'Vui lòng up ảnh hiển thị cho công thức';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      this.submitted = false;
      return;
    }
    if (this.profileForm.value.recipeName === '') {
      this.message = 'Vui lòng điền tên cho công thức';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click(); this.submitted = false;
      return;
    } else if (this.profileForm.value.recipeName.length < 5) {
      this.message = 'Tên công thức có độ dài lớn hơn 10 ký tự';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click(); this.submitted = false;
      return;
    } else if (this.profileForm.value.recipeName.length > 200) {
      this.message = 'Tên cho công thức có độ dài nhỏ hơn 500 ký tự';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click(); this.submitted = false;
      return;
    }
    if (this.profileForm.value.content === '') {
      this.message = 'Vui lòng điền Nội dung cho công thức';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click(); this.submitted = false;
      return;
    } else if (this.profileForm.value.content.length < 20) {
      this.message = 'Nội dung cho công thức có độ dài lớn hơn 20 ký tự';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click(); this.submitted = false;
      return;
    } else if (this.profileForm.value.content.length > 500) {
      this.message = 'Nội dung cho công thức có độ dài nhỏ hơn 500 ký tự';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click(); this.submitted = false;
      return;
    }
    console.log(this.profileForm.value.hardLevel + 'độ khó')
    if (this.profileForm.value.hardLevel === '') {
      this.message = 'Vui lòng chọn độ khó của công thức';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click(); this.submitted = false;
      return;
    }
    // chưa validate
    console.log("time" + this.profileForm.value.time)
    if (parseInt(this.profileForm.value.time) < 0 || this.profileForm.value.time === '') {
      this.message = 'Vui lòng nhập lại thời gian chế biến hợp lệ';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click(); this.submitted = false;
      return;
    }
    if (this.ingredientArrays === undefined || this.ingredientArrays.length == 0) {
      this.message = 'Bạn chưa nhập nguyên liệu của công thức';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click(); this.submitted = false;
      return;
    }
    if (this.profileForm.value.cookStep[0].psnote === '') {
      this.message = 'Vui lòng điền hướng dẫn cho bước công thức';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click(); this.submitted = false;
      return;
    } else if (this.profileForm.value.cookStep[0].psnote.length < 10) {
      this.message = 'Hướng dẫn cho công thức có độ dài lớn hơn 10 ký tự';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click(); this.submitted = false;
      return;
    } else if (this.profileForm.value.cookStep[0].psnote.length > 500) {
      this.message = 'Hướng dẫn cho công thức có độ dài nhỏ hơn 500 ký tự';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click(); this.submitted = false;
      return;
    }
    if (this.cookWayArray.length === 0 || this.countryArray.length === 0 || this.foodTypesArray.length === 0) {
      this.message = 'Vui lòng phân loại cho công thức';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click(); this.submitted = false;
      return;
    }

    this.message === '';
    const recipe: Recipe = this.profileForm.value;
    // recipe.ingredientArray = this.getingredientArray(recipe.ingredients);
    console.log(this.profileForm.value.cookStep);
    if (parseInt(recipe.time) < 0) {
      this.message = 'Thời gian thực hiện phải lớn hơn 0';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click(); this.submitted = false;
      return;
    }
    let cookSteps = this.profileForm.value.cookStep;
    console.log(cookSteps)
    for (let i = 0; i < cookSteps.length; i++) {
      const id = 'imageArray' + i;
      const inputValue = (document.getElementById(id) as HTMLInputElement).value;
      console.log(inputValue);
      cookSteps[i].image = inputValue;
    }
    this.message = '';
    this.saving = true;
    this.cookStepService.createCookSteps(cookSteps).subscribe((data) => {
      console.log('fdaafasf')
      console.log(cookSteps)
      const result = data.body;
      let steps = data.body;
      recipe.cockStep = steps;
      console.log(recipe.cockStep);
      console.log(steps);
      if (steps !== undefined) {

        recipe.user = this.cookie.get('email');
        recipe.country = this.countryArray;
        recipe.foodType = this.foodTypesArray;
        recipe.cookWay = this.cookWayArray;
        recipe.imageUrl = this.nowUrl;
        if (recipe.imageUrl === undefined || recipe.imageUrl === '') {
          console.log(recipe.imageUrl);
          this.message = 'Vui lòng up ảnh hiển thị cho công thức';
          const radio: HTMLElement = document.getElementById('modal-button');
          radio.click(); this.submitted = false;
          return;
        }
        console.log(recipe);

        this.message = '';
        recipe.ingredients = this.ingredientArrays;
        console.log(this.ingredientArrays);
        this.recipeService.registerRecipe(recipe).subscribe((data) => {
          const result = data.body;
          if (result['status'] === 200) {
            this.successMessage = result['message'];
            const radio: HTMLElement = document.getElementById('modal-button');
            radio.click();
            setTimeout(() => {
              window.location.reload()
            }, 3000);
            this.saving = false;
          } else {
            this.message = result['message'];
            const radio: HTMLElement = document.getElementById('modal-button');
            radio.click(); this.submitted = false;
            this.saving = false;
            return;
          }
        });
      }
    });

  }

  getcookStep() {
    return this.profileForm.get('cookStep') as FormArray;
  }

  getInput() {
    return this.profileForm.get('ingredientsGroup') as FormArray;
  }

  addInputs(key) {
    // if duplicate array Validator  Validates as false then add row otherwise error

    if (key === 'cookStep') {
      // if no duplicate text then
      this.cookStep.push(this.addControl());
    } else if (key === 'ingredientsGroup') {
      // if no duplicate text then
      console.log('input');
      this.ingredientsGroup.push(this.addControlNgL());
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
    const id = this.index;
    console.log(this.index);

    console.log(this.imageArrays);
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
    if (this.submitted === true) {
      return;
    }
    // See notes about 'which' and 'key'
    let ingredientString = e.target.value;
    ingredientString = ingredientString.trim();
    if (ingredientString.length > 1) {
      const arrayTest = ingredientString.split(';');
      const j = arrayTest.length;
      if (j > 0) {
        for (let i = 0; i < j; i++) {
          console.log(i);
          let arrTest = arrayTest[i];

          arrTest = arrTest.trim();
          const arrtemp = arrTest;
          arrTest = arrTest.split(' ');
          console.log(arrayTest);
          console.log(arrTest);
          if (arrTest.length < 1) {
            console.log(arrTest)
            this.message = 'Vui lòng nhập lại nguyên liệu cho công thức đúng định dạng';
            const radio: HTMLElement = document.getElementById('modal-button');
            radio.click();
            return;
          }
          let quantity = arrTest[0];
          quantity = quantity.trim();
          const checkQuan = this.checkQuantity(quantity);
          if (!checkQuan) {
            this.message = 'Vui lòng nhập lại số lượng cho nguyên liệu đúng định dạng';
            const radio: HTMLElement = document.getElementById('modal-button');
            radio.click();
            return;
          }
          console.log(quantity);
          let not = '';
          const typeOfqu = arrTest[1];
          let ingredientNam;
          if (arrTest.length > 2) {
            ingredientNam = arrTest[2];
            for (let i = 3; i < arrTest.length; i++) {
              if (arrTest.length > i) {
                var format = /[()]/;
                if (format.test(arrTest[i]) !== true) {
                  ingredientNam += ' ' + arrTest[i];
                } else {
                  break;
                }
              }
            }
            // if (arrTest.length > 3) {
            //   var format = /[()]/;
            //   if (format.test(arrTest[3]) !== true) {
            //     ingredientNam += ' ' + arrTest[3];
            //   }
            // } else
            // if (arrTest.length > 4) {
            //   var format = /[()]/;
            //   if (format.test(arrTest[4]) !== true) {
            //     ingredientNam += ' ' + arrTest[4];
            //   }
            // }
          }
          if (arrTest.length > 3) {
            const notePoisition = arrtemp.indexOf('(');
            if (notePoisition !== undefined && notePoisition > 0) {
              not = arrtemp.slice(notePoisition - 1, arrtemp.length);
            }
          }

          if (arrTest.length >= 2) {

            const ingredient = new Object({

              quantitative: quantity,
              typeOfquantitative: typeOfqu,
              ingredientName: ingredientNam,
              note: not
            });
            // this.ingredientArrays['ingerdient'].push(this.ingredient)
            const removeIndex = this.ingredientArrays.findIndex(itm => itm.ingredientName === ingredient['ingredientName']);

            if (removeIndex !== -1) {
              const mess = ingredient['ingredientName'];
              this.message = 'Nguyên liệu ' + mess.toUpperCase() + ' của bạn đã tồn tại.';
              const radio: HTMLElement = document.getElementById('modal-button');
              radio.click();
              return;
            }
            this.recipeService.createIngredient(ingredient).subscribe((data) => {
              const result = data.body;
              console.log(data);
              if (result != undefined) {
                const tmessage = result['message'];
                console.log(tmessage);
                this.ingredientArrays.push(result);

                const radio = (document.getElementById('ingredientArraye') as HTMLInputElement);
                radio.value = '';
                console.log(this.ingredientArrays);
              } else {
                const tmessage = result['message'];
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
    console.log(index);
    this.recipeService.deleteIngredient(ingredient).subscribe((data) => {
      const result = data.body;
      console.log(data);
      if (result != undefined) {
        const tmessage = result['message'];
        console.log(tmessage);
        this.ingredientArrays.splice(index, 1);
      } else {
        const tmessage = result['message'];
        console.log(tmessage);
      }
    });
  }

  checkQuantity(str: any) {
    console.log(str);
    if (str === '') {
      return false;
    }

    const check = !isNaN(Number(str));
    if (check === true) {
      console.log(check);
      return true;
    } else {
      const patt = new RegExp('[0-9][/][0-9]');
      const res = patt.exec(str);
      console.log(res);
      if (res !== null) {
        return true;
      } else {
        return false;
      }
    }
  }

  onSearchChange(searchValue: Element): void {

    const id: string = 'radio' + searchValue;
    console.log(id);
    const radio: HTMLElement = document.getElementById(id);
    radio.click();


  }

  detectFiles(event) {
    let url;
    // url = this.urlArray[index];
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
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
        };
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
      formArray.removeAt(0);
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
    const country = new Country();
    country.countryCode = data.countryCode;
    country.countryName = data.countryName;
    if (ev.target.checked) {
      // Pushing the object into array
      this.countryArray.push(country);

    } else {
      const removeIndex = this.countryArray.findIndex(itm => itm.countryCode === data.countryCode);

      if (removeIndex !== -1) {
        this.countryArray.splice(removeIndex, 1);
      }
    }


    // Duplicates the obj if we uncheck it
    // How to remove the value from array if we uncheck it
    console.log(this.countryArray);
  }

  getCheckboxValuesFoodType(ev, data) {
    console.log(data);
    console.log(ev);
    const foodType = new FoodType();
    foodType.foodTypeCode = data.foodTypeCode;
    foodType.foodTypeName = data.foodTypeName;
    if (ev.target.checked) {
      // Pushing the object into array
      this.foodTypesArray.push(foodType);

    } else {
      const removeIndex = this.foodTypesArray.findIndex(itm => itm.foodTypeCode === data.foodTypeCode);

      if (removeIndex !== -1) {
        this.foodTypesArray.splice(removeIndex, 1);
      }
    }


    // Duplicates the obj if we uncheck it
    // How to remove the value from array if we uncheck it
    console.log(this.foodTypesArray);
  }

  getCheckboxValuesCookWay(ev, data) {
    console.log(data);
    console.log(ev);
    const cookWay = new CookWay();
    cookWay.cookWayCode = data.cookWayCode;
    cookWay.cookWayName = data.cookWayName;
    if (ev.target.checked) {
      // Pushing the object into array
      console.log(cookWay);
      this.cookWayArray.push(cookWay);

    } else {
      const removeIndex = this.cookWayArray.findIndex(itm => itm.cookWayCode === data.cookWayCode);

      if (removeIndex !== -1) {
        this.cookWayArray.splice(removeIndex, 1);
      }
    }


    // Duplicates the obj if we uncheck it
    // How to remove the value from array if we uncheck it
    console.log(this.cookWayArray);
  }
}

interface Object {
  [key: string]: any;
}
