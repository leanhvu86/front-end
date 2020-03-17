import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Observable, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Interest } from '../model/interest';
import { AppSetting } from '../../appsetting'
import { retry, catchError, tap } from 'rxjs/operators';
import { Recipe } from '../model/recipe';

import { Cloudinary } from '@cloudinary/angular-5.x';
@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  headerOptions: any = null
  private cloudinary: Cloudinary
  _isLoggedIn: boolean = false

  authSub = new Subject<any>();
  // private baseUrl: string = 'http://localhost:8000';
  private baseUrl: string = AppSetting.BASE_SERVER_URL;
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
        'x-tfa': userObj.authcode
      });
    }
    return this._http.post(`${this.baseUrl}/login`, { user: userObj }, { observe: 'response', headers: this.headerOptions });
  }

  // setupAuth(email: any) {
  //   return this._http.post("http://localhost:8000/currentAuthen", { email: email }, { observe: 'response' })
  // }

  registerRecipe(recipe: any) {
    return this._http.post(`${this.baseUrl}/createRecipe`, { recipe: recipe }, { observe: "response" });
  }
  acceptRecipe(recipe: any) {
    return this._http.post(`${this.baseUrl}/acceptRecipe`, { recipe: recipe }, { observe: "response" });
  }
  declineRecipe(recipe: any) {
    return this._http.post(`${this.baseUrl}/declineRecipe`, { recipe: recipe }, { observe: "response" });
  }
  getRecipes = (): Observable<Recipe[]> => {
    return this._http.get<Recipe[]>(`${this.baseUrl}/recipes`)
      .pipe(
        tap(_ => console.log('load recipes'))
      );
  }
  getAllRecipes = (): Observable<Recipe[]> => {
    return this._http.get<Recipe[]>(`${this.baseUrl}/getAllRecipes`)
      .pipe(
        tap(_ => console.log('load getAllRecipes'))
      );
  }
  likeRecipe(interest: any) {
    return this._http.post(`${this.baseUrl}/likeRecipe`, { interest: interest }, { observe: "response" });
  }
  addComment(comment: any) {
    return this._http.post(`${this.baseUrl}/addComment`, { comment: comment }, { observe: "response" });
  }
  dislikeRecipe(interest: any) {
    return this._http.post(`${this.baseUrl}/dislikeRecipe`, { interest: interest }, { observe: "response" });
  }
  // findInterest = (user: any): Observable<Interest> => {
  //   const url = `${this.baseUrl}/findRecipe/${user}`;
  //   return this._http.get<Interest[]>(url)
  //     .pipe(
  //       tap(_ => console.log('load interests'))
  //     );
  // }
  getRecipeDetail = (id: string): Observable<Recipe> => {
    const url = `${this.baseUrl}/findRecipe/${id}`;
    return this._http.get<Recipe>(url).pipe(
      tap(_ => console.log('helo'))
    );
    //return this._http.post("http://localhost:8000/findRecipe", { id: id }, { observe: "response" });
  }
  createIngredient(ingredient: any) {
    return this._http.post(`${this.baseUrl}/createIngredient`, { ingredient }, { observe: 'response' });
  }
  deleteIngredient(ingredient: any) {
    return this._http.post(`${this.baseUrl}/deleteIngredient`, { ingredient }, { observe: 'response' });
  }

}
