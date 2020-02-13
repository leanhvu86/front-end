import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Province } from '../model/province';
import { Observable } from 'rxjs';
import { callbackify } from 'util';
@Injectable({
  providedIn: 'root'
})
export class ProvinceService {
  headerOptions: any = null
  private baseUrl: string = 'http://localhost:8000';
  constructor(private _http: HttpClient) {
  }

  private log(message: string) {
    console.log('loi province service' + message);
  }

  getProvinces = (): Observable<Province[]> => {

    return this._http.get<Province[]>(`${this.baseUrl}/provinces`)
      .pipe(
        tap(_ => console.log('load province'))
      );
  }
}

