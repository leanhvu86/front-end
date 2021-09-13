import {Component, Input, NgZone, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FileUploader} from 'ng2-file-upload';
import {RxwebValidators} from '@rxweb/reactive-form-validators';
import {Country} from 'src/app/shared/model/country';
import {CountryService} from 'src/app/shared/service/country.service';
import {FoodType} from 'src/app/shared/model/foodType';
import {CookWay} from 'src/app/shared/model/cookWay';
import {Recipe} from 'src/app/shared/model/recipe';
import {RecipeService} from 'src/app/shared/service/recipe-service.service';
import {Router} from '@angular/router';
import {Cloudinary} from '@cloudinary/angular-5.x';
import {HttpClient} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {CookStepService} from '../../shared/service/cook-step.service';
import {ChatService} from 'src/app/shared/service/chat.service';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-register-passenger',
  templateUrl: './register-passenger.component.html',
  styleUrls: ['./register-passenger.component.css']
})

export class RegisterPassengerComponent implements OnInit {
  profileForm: FormGroup;
  cookStep: FormArray;
  ingredientsGroup: FormArray;
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
  submitted = false;
  @Input()
  responses: Array<any>;
  nowUrl: string = null;
  // tslint:disable-next-line:ban-types
  ingredientArrays: Object[] = [];
  uploader: FileUploader;
  title: string;
  successMessage = '';
  listRoomImgCurrent = [] = [];
  navHide = false;
  // url = AppSetting.BASE_SERVER_URL + '/api/upload';
  imageProp = 'recipe';
  url: any;

  constructor(private cloudinary: Cloudinary, private titleMain: Title,
              private zone: NgZone, private http: HttpClient,
              private formbuilder: FormBuilder, private countryService: CountryService, private cookStepService: CookStepService,
              private recipeService: RecipeService, private _router: Router, private cookie: CookieService, private chatService: ChatService
  ) {
    this.responses = [];
    this.title = '';
    this.listRoomImgCurrent = [];
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
    this.titleMain.setTitle('Tạo công thức');
    this.getCountrys();
    this.getFoodTypes();
    this.getCookWays();
    this.cookStep = this.profileForm.get('cookStep') as FormArray;
  }

  getImageSrc(event: any) {
    const imageRes = JSON.parse(event);
    console.log(imageRes.filePath);
    const radio = (document.getElementById('profilePhoto') as HTMLInputElement);
    radio.value = imageRes.filePath;
  }

  getImageSrcTypeRoom(event: any, i) {
    const id = 'imageArray' + i;
    const pshArrayImage = new Set();
    const str = '[' + event.toString().replace(/}\n?{/g, '},{') + ']';
    JSON.parse(str).forEach((obj) => {
      pshArrayImage.add(obj.filePath);
    });
    if (pshArrayImage.size > 5) {
      this.message = 'Bạn chỉ có thể nhập 5 ảnh cho 1 bước!';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
    }
    const newImage = Array.from(pshArrayImage).join(',');
    console.log('đây là mảng ảnh mới:' + newImage);
    console.log('vị trí', i);
    const radio = (document.getElementById(id) as HTMLInputElement);
    radio.value = newImage;
  }

  getIndexDelete(event: any, i) {
    const id = 'imageArray' + i;
    const value = (document.getElementById(id) as HTMLInputElement).value;
    const radio = (document.getElementById(id) as HTMLInputElement);
    radio.value = '';
  }

  onSubmit() {
    if (this.saving === true) {
      return;
    }
    this.submitted = true;
    console.log('submit');
    console.log(this.nowUrl);
    let profilePhoto = (document.getElementById('profilePhoto') as HTMLInputElement).value;
    if (profilePhoto === undefined || profilePhoto === '') {
      console.log(profilePhoto);
      this.message = 'Vui lòng up ảnh hiển thị cho công thức';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      this.submitted = false;
      return;
    }
    if (this.profileForm.value.recipeName === '') {
      this.message = 'Vui lòng điền tên cho công thức';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      this.submitted = false;
      return;
    } else if (this.profileForm.value.recipeName.length < 5) {
      this.message = 'Tên công thức có độ dài lớn hơn 10 ký tự';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      this.submitted = false;
      return;
    } else if (this.profileForm.value.recipeName.length > 200) {
      this.message = 'Tên cho công thức có độ dài nhỏ hơn 500 ký tự';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      this.submitted = false;
      return;
    }
    if (this.profileForm.value.content === '') {
      this.message = 'Vui lòng điền Nội dung cho công thức';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      this.submitted = false;
      return;
    } else if (this.profileForm.value.content.length < 20) {
      this.message = 'Nội dung cho công thức có độ dài lớn hơn 20 ký tự';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      this.submitted = false;
      return;
    } else if (this.profileForm.value.content.length > 500) {
      this.message = 'Nội dung cho công thức có độ dài nhỏ hơn 500 ký tự';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      this.submitted = false;
      return;
    }
    console.log(this.profileForm.value.hardLevel + 'độ khó');
    if (this.profileForm.value.hardLevel === '') {
      this.message = 'Vui lòng chọn độ khó của công thức';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      this.submitted = false;
      return;
    }
    // chưa validate
    if (parseInt(this.profileForm.value.time) < 0 || this.profileForm.value.time === '') {
      this.message = 'Vui lòng nhập lại thời gian chế biến hợp lệ';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      this.submitted = false;
      return;
    }
    if (this.ingredientArrays === undefined || this.ingredientArrays.length == 0) {
      this.message = 'Bạn chưa nhập nguyên liệu của công thức';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      this.submitted = false;
      return;
    }
    if (this.profileForm.value.cookStep[0].psnote === '') {
      this.message = 'Vui lòng điền hướng dẫn cho bước công thức';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      this.submitted = false;
      return;
    } else if (this.profileForm.value.cookStep[0].psnote.length < 10) {
      this.message = 'Hướng dẫn cho công thức có độ dài lớn hơn 10 ký tự';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      this.submitted = false;
      return;
    } else if (this.profileForm.value.cookStep[0].psnote.length > 500) {
      this.message = 'Hướng dẫn cho công thức có độ dài nhỏ hơn 500 ký tự';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      this.submitted = false;
      return;
    }
    if (this.cookWayArray.length === 0 || this.countryArray.length === 0 || this.foodTypesArray.length === 0) {
      this.message = 'Vui lòng phân loại cho công thức';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      this.submitted = false;
      return;
    }

    this.message === '';
    const recipe: Recipe = this.profileForm.value;
    // recipe.ingredientArray = this.getingredientArray(recipe.ingredients);
    if (parseInt(recipe.time) < 0) {
      this.message = 'Thời gian thực hiện phải lớn hơn 0';
      const radio: HTMLElement = document.getElementById('modal-button');
      radio.click();
      this.submitted = false;
      return;
    }
    let cookSteps = this.profileForm.value.cookStep;
    for (let i = 0; i < cookSteps.length; i++) {
      const id = 'imageArray' + i;
      const inputValue = (document.getElementById(id) as HTMLInputElement).value;
      console.log(inputValue);
      cookSteps[i].image = inputValue;
    }
    this.message = '';
    this.saving = true;
    this.cookStepService.createCookSteps(cookSteps).subscribe((data) => {
      console.log('fdaafasf');
      console.log(cookSteps);
      const result = data.body;
      const steps = data.body;
      recipe.cockStep = steps;
      if (steps !== undefined) {

        recipe.user = localStorage.getItem('email');
        recipe.country = this.countryArray;
        recipe.foodType = this.foodTypesArray;
        recipe.cookWay = this.cookWayArray;
        recipe.imageUrl = profilePhoto;
        if (recipe.imageUrl === undefined || recipe.imageUrl === '') {
          console.log(recipe.imageUrl);
          this.message = 'Vui lòng up ảnh hiển thị cho công thức';
          const radio: HTMLElement = document.getElementById('modal-button');
          radio.click();
          this.submitted = false;
          return;
        }
        console.log(recipe);

        this.message = '';
        recipe.ingredients = this.ingredientArrays;
        let nameSpace = recipe.recipeName;
        nameSpace = nameSpace.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        nameSpace = nameSpace.toLowerCase();
        let name = nameSpace.split(' ');
        nameSpace = name.join('-');
        recipe.nameSpace = nameSpace;
        this.recipeService.registerRecipe(recipe).subscribe((data) => {
          const result = data.body;
          if (result['status'] === 200) {
            this.successMessage = result['message'];
            const radio: HTMLElement = document.getElementById('modal-button');
            radio.click();
            setTimeout(() => {
              window.location.reload();
            }, 3000);
            this.saving = false;
            this.chatService.identifyUser();
          } else {
            this.message = result['message'];
            const radio: HTMLElement = document.getElementById('modal-button');
            radio.click();
            this.submitted = false;
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

    return this.formbuilder.group({
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
            console.log(arrTest);
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
            // tslint:disable-next-line:no-shadowed-variable
            for (let i = 3; i < arrTest.length; i++) {
              if (arrTest.length > i) {
                const format = /[()]/;
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
            const notePosition = arrtemp.indexOf('(');
            if (notePosition !== undefined && notePosition > 0) {
              not = arrtemp.slice(notePosition - 1, arrtemp.length);
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
              if (result !== undefined) {
                const dressage = result['message'];
                console.log(dressage);
                this.ingredientArrays.push(result);

                const radio = (document.getElementById('ingredientArraye') as HTMLInputElement);
                radio.value = '';
                console.log(this.ingredientArrays);
              } else {
                const dressage = result['message'];
                console.log(dressage);
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

  onChangeOfVideo(value: any) {
    if (this.showVideoTutorial === false) {
      this.showVideoTutorial = true;
      console.log('add');
    } else {
      this.showVideoTutorial = false;
      console.log('remove');

    }

  }

  clickNav() {
    if (this.navHide === false) {

      this.navHide = true;
    } else {

      this.navHide = false;
    }
    const radio: HTMLElement = document.getElementById('scroll-to-top');
    radio.click();
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
  };

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
