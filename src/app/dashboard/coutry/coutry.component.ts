import { Component, OnInit } from '@angular/core';
import { CountryService } from 'src/app/shared/service/country.service';
import { Country } from 'src/app/shared/model/country';

@Component({
  selector: 'app-coutry',
  templateUrl: './coutry.component.html',
  styleUrls: ['./coutry.component.css']
})
export class CoutryComponent implements OnInit {

  constructor(private countryService: CountryService) { }
  public countrys: Country[] = [];
  ngOnInit() {
    this.getCountrys();
  }
  getCountrys() {


    this.countryService.getCountrys().subscribe(countrys => {
      this.countrys = countrys;
      console.log('countrys' + this.countrys);
    });
  }
}
