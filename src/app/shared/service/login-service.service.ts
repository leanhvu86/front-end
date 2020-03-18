import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Observable, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Token } from '../model/token';

import { AppSetting } from '../../appsetting'
import { retry, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  headerOptions: any = null

  private baseUrl: string = AppSetting.BASE_SERVER_URL;
  _isLoggedIn: boolean = false

  authSub = new Subject<any>();

  constructor(private _http: HttpClient, private cookie: CookieService) {
  }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  loginAuth(userObj: any) {
    if (userObj.authcode) {
      console.log('Appending headers');
      this.headerOptions = new HttpHeaders({
        'x-tfa': userObj.authcode,
        'Authorization': 'Bear' + 'fdasfsafasfsafasfdsdafdasfaf'
      });
    }
    return this._http.post(`${this.baseUrl}/login`, { user: userObj }, { observe: 'response', headers: this.headerOptions });
  }

  // setupAuth(email: any) {
  //   return this._http.post("http://localhost:8000/currentAuthen", { email: email }, { observe: 'response' })
  // }

  registerUser(userObj: any) {
    return this._http.post(`${this.baseUrl}/register`, { user: userObj }, { observe: "response" });
  }

  updateAuthStatus(value: boolean) {
    this._isLoggedIn = value
    this.authSub.next(this._isLoggedIn);
    localStorage.setItem('isLoggedIn', value ? "true" : "false");
  }

  getAuthStatus() {
    this._isLoggedIn = localStorage.getItem('isLoggedIn') == "true" ? true : false;
    return this._isLoggedIn
  }

  logoutUser() {
    this._isLoggedIn = false;
    this.authSub.next(this._isLoggedIn);
    localStorage.setItem('isLoggedIn', "false");
    this.cookie.set('isAuthenicate', '');
    sessionStorage.setItem('token', '');
    this.cookie.set('email', '');
    this.cookie.set('role', '');
    let token = this.cookie.get('token');
    console.log('xóa token nè' + token);
    this.deleteAuth(token).subscribe((data) => {
      const result = data.body;
      if (data['status'] === 200) {

        if (result == null) {
          console.log(result);
        } else {
          console.log(result);

          this.cookie.set('token', result[0]);
        }
      }
    });
    this.cookie.set('token', '');

  }

  // getAuth() {
  //   return this._http.get("http://localhost:3000/tfa/setup", { observe: 'response' });
  // }

  testEmail(email: any) {
    return this._http.post(`${this.baseUrl}/testEmail`, { email: email }, { observe: 'response' })
  }

  deleteAuth(token: any) {
    this.headerOptions = new HttpHeaders({
      'x-access-token': token,
      'Authorization': 'Bear' + token
    });
    return this._http.post(`${this.baseUrl}/deleteToken`, { token: token }, { observe: 'response' })
  }
  // Error handling 
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  verifyAuth(email: any) {
    return this._http.post(`${this.baseUrl}/currentAuthen`, { email: email }, { observe: 'response' })
  }

}
