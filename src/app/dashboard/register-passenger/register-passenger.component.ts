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
@Component({
  selector: 'app-register-passenger',
  templateUrl: './register-passenger.component.html',
  styleUrls: ['./register-passenger.component.css']
})

export class RegisterPassengerComponent implements OnInit {
  profileForm: FormGroup;
  aliaseS: FormArray;
  myInputs: FormArray;
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
  constructor(
    private formbuilder: FormBuilder, private countryService: CountryService
  ) {
    this.profileForm = this.formbuilder.group({
      recipeName: ['', Validators.required],
      content: ['', Validators.required],
      videoLink: [''],
      hardLevel: ['', Validators.required],
      time: ['', Validators.required],
      ingredients: ['']
      ,
      myInputs: this.formbuilder.array([this.addControlNgL() //add duplicate array Validator
      ]),
      aliases: this.formbuilder.array([this.addControl()
        //add duplicate array Validator
      ])
    })
  }

  ngOnInit() {
    this.getCountrys();
    this.getFoodTypes();
    this.getCookWays();
    this.aliaseS = this.profileForm.get('aliases') as FormArray;
    this.myInputs = this.profileForm.get('myInputs') as FormArray;
  }
  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
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
    // chưa validate
    if (this.profileForm.value === undefined) {
      return;
    }
    let recepie = this.profileForm.value;
    recepie.country = this.countryArray;
    recepie.foodType = this.foodTypesArray;
    recepie.cookWayArray = this.cookWayArray;
    console.warn(recepie);
  }

  getAliases() {
    return this.profileForm.get('aliases') as FormArray;
  }
  getInput() {
    return this.profileForm.get('myInputs') as FormArray;
  }

  addInputs(key) {
    //if duplicate array Validator  Validates as false then add row otherwise error

    if (key === 'aliases') {
      // if no duplicate text then
      this.aliaseS.push(this.addControl());
    } else if (key === 'myInputs') {
      // if no duplicate text then
      console.log('input');
      this.myInputs.push(this.addControlNgL())
    }
  }
  deleteAlias(pos) {
    this.index--;
    console.log(this.index);
    this.aliaseS.removeAt(pos);
  }

  deleteInputs(pos) {
    this.myInputs.removeAt(pos);
  }
  addControl() {
    this.index++;
    let id = this.index;
    console.log(this.index);
    return this.formbuilder.group({
      index: this.formbuilder.control(id, RxwebValidators.unique()),
      name: this.formbuilder.control('', RxwebValidators.unique()),
      time: this.formbuilder.control('', RxwebValidators.unique()),
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
      this.clearFormArray(this.myInputs);

    }

  }
  onSearchChange(searchValue: Element): void {

    let id: string = 'radio' + searchValue;
    console.log(id);
    //searchValue.nextElementSibling.setAttribute("checked", "checked");
    const radio: HTMLElement = document.getElementById(id);
    radio.click();
    // const togglers = document.querySelectorAll('.radioCheck');
    // //console.log(togglers);
    // togglers.forEach(function (el) {
    //   el.addEventListener('keyup', function (e) {
    //     //const content = el.innerHTML;
    //     //console.log(content);
    //     el.nextElementSibling.setAttribute("checked", "checked");
    //   })
    // });

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
