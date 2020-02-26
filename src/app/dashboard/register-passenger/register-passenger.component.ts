import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, ValidatorFn, FormArray } from '@angular/forms';
import { ProvinceService } from 'src/app/shared/service/province.service';
import { Province } from 'src/app/shared/model/province';
import { Passenger } from 'src/app/shared/model/passenger';

import { RxwebValidators } from "@rxweb/reactive-form-validators"
import { Country } from 'src/app/shared/model/country';
import { CountryService } from 'src/app/shared/service/country.service';
import { FoodType } from 'src/app/shared/model/foodType';
import { CookWay } from 'src/app/shared/model/cookWay';
import { Recipe } from 'src/app/shared/model/recipe';
import { RecipeService } from 'src/app/shared/service/recipe-service.service';
import { Router } from '@angular/router';
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
  submitted = false;
  constructor(
    private formbuilder: FormBuilder, private countryService: CountryService,
    private recipeService: RecipeService, private _router: Router
  ) {
    this.profileForm = this.formbuilder.group({
      recipeName: ['', [Validators.minLength(5), Validators.maxLength(200), Validators.required]],
      content: ['', [Validators.minLength(20), Validators.maxLength(500), Validators.required]],
      videoLink: [''],
      hardLevel: [''],
      time: ['', Validators.required],
      ingredients: ['', [Validators.minLength(5), Validators.maxLength(500), Validators.required]]
      ,
      ingredientsGroup: this.formbuilder.array([this.addControlNgL() //add duplicate array Validator
      ]),
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
    this.ingredientsGroup = this.profileForm.get('ingredientsGroup') as FormArray;
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
    let recepie: Recipe = this.profileForm.value;
    recepie.country = this.countryArray;
    recepie.foodType = this.foodTypesArray;
    recepie.cookWay = this.cookWayArray;

    console.log(recepie);
    this.recipeService.registerRecipe(recepie).subscribe((data) => {
      const result = data.body
      if (result['status'] === 200) {
        this.message = result['message'];
        const radio: HTMLElement = document.getElementById('modal-button');
        radio.click();
        setTimeout(() => {
          this._router.navigate(['/index']);
        }, 5000);
      } else {
        this.message = result['message'];
        const radio: HTMLElement = document.getElementById('modal-button');
        radio.click();
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
      check: this.formbuilder.control('')
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
  onSearchChange(searchValue: Element): void {

    let id: string = 'radio' + searchValue;
    console.log(id);
    const radio: HTMLElement = document.getElementById(id);
    radio.click();


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
