import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, ValidatorFn, FormArray } from '@angular/forms';
import { ProvinceService } from 'src/app/shared/service/province.service';
import { Province } from 'src/app/shared/model/province';
import { Passenger } from 'src/app/shared/model/passenger';

import { RxwebValidators } from "@rxweb/reactive-form-validators"
@Component({
  selector: 'app-register-passenger',
  templateUrl: './register-passenger.component.html',
  styleUrls: ['./register-passenger.component.css']
})

export class RegisterPassengerComponent implements OnInit {
  profileForm: FormGroup;
  aliaseS: FormArray;
  myInputs: FormArray;

  public showVideoTutorial: boolean = false;
  public show: boolean = false;
  public showIngredient: boolean = false;
  constructor(
    private formbuilder: FormBuilder
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
    this.aliaseS = this.profileForm.get('aliases') as FormArray;
    this.myInputs = this.profileForm.get('myInputs') as FormArray;
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
    console.warn(this.profileForm.value);
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
    this.aliaseS.removeAt(pos);
  }

  deleteInputs(pos) {
    this.myInputs.removeAt(pos);
  }
  addControl() {
    return this.formbuilder.group({
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
}
