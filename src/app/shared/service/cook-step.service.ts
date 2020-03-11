import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
// @ts-ignore
import { cookStep } from '../model/cookStep';
import { Observable } from 'rxjs';
import { callbackify } from 'util';
@Injectable({
  providedIn: 'root'
})
export class CookStepService {
  headerOptions: any = null
  private baseUrl = 'http://localhost:8000';
  constructor(private http: HttpClient) {
  }

  private log(message: string) {
    console.log('loi cookStep service' + message);
  }

  getcookSteps = (): Observable<cookStep[]> => {

    return this.http.get<cookStep[]>(`${this.baseUrl}/cookSteps`)
      .pipe(
        tap(_ => console.log('load cookStep'))
      );
  }
  // tslint:disable-next-line:no-shadowed-variable
  createCookSteps(cookSteps: any) {
    return this.http.post('http://localhost:8000/createMultipleCookStep', { cookSteps }, { observe: 'response' });
  }
}

