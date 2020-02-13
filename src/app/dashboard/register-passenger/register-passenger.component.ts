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

  constructor(
    private formbuilder: FormBuilder
  ) {
    this.profileForm = this.formbuilder.group({
      firstName: ['', Validators.required],
      lastName: [''],
      contact: this.formbuilder.group({
        mobileNo: [''],
        state: [''],
        city: ['']
      }),
      aliases: this.formbuilder.array([this.addControl()
        //add duplicate array Validator
      ]),
      myInputs: this.formbuilder.array([this.addControl() //add duplicate array Validator
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
    console.warn(this.profileForm.value);
  }

  getAliases() {
    return this.profileForm.get('aliases') as FormArray;
  }

  addInputs(key) {
    //if duplicate array Validator  Validates as false then add row otherwise error

    if (key === 'aliases') {
      // if no duplicate text then
      this.aliaseS.push(this.addControl());
    } else if (key === 'myInputs ') {
      // if no duplicate text then
      this.myInputs.push(this.addControl())
    }
  }
  deleteAlias(pos) {
    this.aliaseS.removeAt(pos);
  }

  addControl() {
    return this.formbuilder.group({
      name: this.formbuilder.control('', RxwebValidators.unique())
    });
  }
}
