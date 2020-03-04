import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Observable, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Token } from '../model/token';

import { retry, catchError, tap } from 'rxjs/operators';
import { Recipe } from '../model/recipe';
@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  headerOptions: any = null

  _isLoggedIn: boolean = false

  authSub = new Subject<any>();
  private baseUrl: string = 'http://localhost:8000';
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
    return this._http.post("http://localhost:8000/login", { user: userObj }, { observe: 'response', headers: this.headerOptions });
  }

  // setupAuth(email: any) {
  //   return this._http.post("http://localhost:8000/currentAuthen", { email: email }, { observe: 'response' })
  // }

  registerRecipe(recipe: any) {
    return this._http.post("http://localhost:8000/createRecipe", { recipe: recipe }, { observe: "response" });
  }

  getRecipes = (): Observable<Recipe[]> => {

    return this._http.get<Recipe[]>(`${this.baseUrl}/recipes`)
      .pipe(
        tap(_ => console.log('load recipes'))
      );
  }
  likeRecipe(interest: any) {
    return this._http.post("http://localhost:8000/likeRecipe", { interest: interest }, { observe: "response" });
  }
  dislikeRecipe(interest: any) {
    return this._http.post("http://localhost:8000/dislikeRecipe", { interest: interest }, { observe: "response" });
  }

  getRecipeDetail = (id: any): Observable<Recipe> => {
    const url = `${this.baseUrl}/findRecipe/${id}`;
    return this._http.get<Recipe>(url).pipe(
      tap(_ => console.log('ok'))
    );
  };
  createIngredient(ingredient: any) {
    return this._http.post("http://localhost:8000/createIngredient", { ingredient: ingredient }, { observe: "response" });
  }
  deleteIngredient(ingredient: any) {
    return this._http.post("http://localhost:8000/deleteIngredient", { ingredient: ingredient }, { observe: "response" });
  }
}
