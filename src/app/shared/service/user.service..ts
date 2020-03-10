import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Observable, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Token } from '../model/token';

import { retry, catchError, tap } from 'rxjs/operators';
import { User } from '../model/user';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl: string = 'http://localhost:8000';
  headerOptions: any = null

  _isLoggedIn: boolean = false

  authSub = new Subject<any>();

  constructor(private _http: HttpClient, private cookie: CookieService) {
  }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  // loginAuth(userObj: any) {
  //   if (userObj.authcode) {
  //     console.log('Appending headers');
  //     this.headerOptions = new HttpHeaders({
  //       'x-tfa': userObj.authcode
  //     });
  //   }
  //   return this._http.post("http://localhost:8000/login", { user: userObj }, { observe: 'response', headers: this.headerOptions });
  // }

  // // setupAuth(email: any) {
  // //   return this._http.post("http://localhost:8000/currentAuthen", { email: email }, { observe: 'response' })
  // // }

  // registerUser(userObj: any) {
  //   return this._http.post("http://localhost:8000/register", { user: userObj }, { observe: "response" });
  // }

  // updateAuthStatus(value: boolean) {
  //   this._isLoggedIn = value
  //   this.authSub.next(this._isLoggedIn);
  //   localStorage.setItem('isLoggedIn', value ? "true" : "false");
  // }

  // getAuthStatus() {
  //   this._isLoggedIn = localStorage.getItem('isLoggedIn') == "true" ? true : false;
  //   return this._isLoggedIn
  // }

  // logoutUser() {
  //   this._isLoggedIn = false;
  //   this.authSub.next(this._isLoggedIn);
  //   localStorage.setItem('isLoggedIn', "false");
  //   this.cookie.set('isAuthenicate', '');
  //   let token = this.cookie.get('token');
  //   console.log('xóa token nè' + token);
  //   this.deleteAuth(token).subscribe((data) => {
  //     const result = data.body;
  //     if (data['status'] === 200) {

  //       if (result == null) {
  //         console.log(result);
  //       } else {
  //         console.log(result);

  //         this.cookie.set('token', result[0]);
  //       }
  //     }
  //   });
  //   this.cookie.set('token', '');

  // }

  // getAuth() {
  //   return this._http.get("http://localhost:3000/tfa/setup", { observe: 'response' });
  // }


  // deleteAuth(token: any) {
  //   return this._http.post("http://localhost:8000/deleteToken", { token: token }, { observe: 'response' })
  // }
  // // Error handling 
  // handleError(error) {
  //   let errorMessage = '';
  //   if (error.error instanceof ErrorEvent) {
  //     // Get client-side error
  //     errorMessage = error.error.message;
  //   } else {
  //     // Get server-side error
  //     errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  //   }
  //   window.alert(errorMessage);
  //   return throwError(errorMessage);
  // }

  likeAddPoint(user: any) {
    return this._http.post("http://localhost:8000/addPoint", { user: user }, { observe: "response" });
  }
  dislikeremovePoint(user: any) {
    return this._http.post("http://localhost:8000/removePoint", { user: user }, { observe: "response" });
  }
  getRecipes = (): Observable<User[]> => {

    return this._http.get<User[]>(`${this.baseUrl}/getUsers`)
      .pipe(
        tap(_ => console.log('load users'))
      );
  }
}
