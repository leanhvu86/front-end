import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Country } from '../model/country';
@Injectable({
  providedIn: 'root'
})
export class CountryService {
  headerOptions: any = null
  private baseUrl: string = 'http://localhost:8000';
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
}

