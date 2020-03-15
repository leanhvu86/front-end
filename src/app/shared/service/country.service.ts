import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Country } from '../model/country';
import { FoodType } from '../model/foodType';
import { CookWay } from '../model/cookWay';

import { AppSetting } from '../../appsetting'
@Injectable({
  providedIn: 'root'
})
export class CountryService {
  headerOptions: any = null
  private baseUrl: string = AppSetting.BASE_SERVER_URL;
  constructor(private _http: HttpClient) {
  }

  private log(message: string) {
    console.log('loi Country service' + message);
  }

  getCountrys = (): Observable<Country[]> => {

    return this._http.get<Country[]>(`${this.baseUrl}/countrys`)
      .pipe(
        tap(_ => console.log('load countrys'))
      );
  }

  getFoodTypes = (): Observable<FoodType[]> => {

    return this._http.get<FoodType[]>(`${this.baseUrl}/foodTypes`)
      .pipe(
        tap(_ => console.log('load FoodType'))
      );
  }

  getCookWays = (): Observable<CookWay[]> => {

    return this._http.get<CookWay[]>(`${this.baseUrl}/cookWays`)
      .pipe(
        tap(_ => console.log('load FoodType'))
      );
  }
}

