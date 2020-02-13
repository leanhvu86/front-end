import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  headerOptions: any = null

  _isLoggedIn: boolean = false

  authSub = new Subject<any>();

  constructor(private _http: HttpClient) {
  }

  loginAuth(userObj: any) {
    if (userObj.authcode) {
      console.log('Appending headers');
      this.headerOptions = new HttpHeaders({
        'x-tfa': userObj.authcode
      });
    }
    return this._http.post("http://localhost:8000/login", { user: userObj }, { observe: 'response', headers: this.headerOptions });
  }

  // setupAuth(email: any) {
  //   return this._http.post("http://localhost:8000/currentAuthen", { email: email }, { observe: 'response' })
  // }

  registerUser(userObj: any) {
    return this._http.post("http://localhost:8000/register", { user: userObj }, { observe: "response" });
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
    localStorage.setItem('isLoggedIn', "false")
  }

  // getAuth() {
  //   return this._http.get("http://localhost:3000/tfa/setup", { observe: 'response' });
  // }

  // deleteAuth() {
  //   return this._http.delete("http://localhost:3000/tfa/setup", { observe: 'response' });
  // }

  verifyAuth(email: any) {
    return this._http.post("http://localhost:8000/currentAuthen", { email: email }, { observe: 'response' })
  }
}
