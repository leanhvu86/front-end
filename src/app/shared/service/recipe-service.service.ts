import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Subject, Observable, throwError} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';
import {Interest} from '../model/interest';
import {AppSetting} from '../../appsetting';
import {retry, catchError, tap} from 'rxjs/operators';
import {Recipe} from '../model/recipe';


@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  headerOptions: any = null;
  _isLoggedIn: boolean = false;

  authSub = new Subject<any>();
  // private baseUrl: string = 'http://localhost:8000';
  private baseUrl: string = AppSetting.BASE_SERVER_URL;

  constructor(private _http: HttpClient, private cookie: CookieService) {
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  loginAuth(userObj: any) {
    if (userObj.authcode) {
      console.log('Appending headers');
      this.headerOptions = new HttpHeaders({
        'x-tfa': userObj.authcode
      });
    }
    return this._http.post(`${this.baseUrl}/login`, {user: userObj}, {observe: 'response', headers: this.headerOptions});
  }

  // setupAuth(email: any) {
  //   return this._http.post("http://localhost:8000/currentAuthen", { email: email }, { observe: 'response' })
  // }

  registerRecipe(recipe: any) {
    return this._http.post(`${this.baseUrl}/createRecipe`, {recipe: recipe}, {observe: 'response'});
  }

  acceptRecipe(recipe: any) {
    return this._http.post(`${this.baseUrl}/acceptRecipe`, {recipe: recipe}, {observe: 'response'});
  }

  declineRecipe(recipe: any) {
    return this._http.post(`${this.baseUrl}/declineRecipe`, {recipe: recipe}, {observe: 'response'});
  }

  getRecipes = (): Observable<Recipe[]> => {
    return this._http.get<Recipe[]>(`${this.baseUrl}/recipes`)
      .pipe(
        tap(_ => console.log('load recipes'))
      );
  };

  deleteImage(imgName: any) {
    return this._http.post(`${this.baseUrl}/api/deleteImage/` + imgName, {}, {observe: 'response'});
  }

  getNewRecipes = (): Observable<Recipe[]> => {
    return this._http.get<Recipe[]>(`${this.baseUrl}/getNewRecipes`)
      .pipe(
        tap(_ => console.log('load getNewRecipes'))
      );
  };
  getAllRecipes = (): Observable<Recipe[]> => {
    return this._http.get<Recipe[]>(`${this.baseUrl}/getAllRecipes`)
      .pipe(
        tap(_ => console.log('load getAllRecipes'))
      );
  };

  likeRecipe(interest: any) {
    return this._http.post(`${this.baseUrl}/likeRecipe`, {object: interest}, {observe: 'response'});
  }

  addComment(comment: any) {
    return this._http.post(`${this.baseUrl}/addComment`, {comment: comment}, {observe: 'response'});
  }

  deleteComment(comment: any) {
    return this._http.post(`${this.baseUrl}/deleteComment`, {comment: comment}, {observe: 'response'});
  }

  dislikeRecipe(interest: any) {
    return this._http.post(`${this.baseUrl}/dislikeRecipe`, {object: interest}, {observe: 'response'});
  }

  findInterest(user: any) {
    return this._http.post(`${this.baseUrl}/findInterest`, {user: user}, {observe: 'response'});
  }

  findInterestGallery(user: any) {
    return this._http.post(`${this.baseUrl}/findInterestGallery`, {user: user}, {observe: 'response'});
  }

  getRecipeDetail = (id: string): Observable<Recipe> => {
    const url = `${this.baseUrl}/findRecipe/${id}`;
    return this._http.get<Recipe>(url).pipe(
      tap(_ => console.log('helo'))
    );
  };

  createIngredient(ingredient: any) {
    return this._http.post(`${this.baseUrl}/createIngredient`, {ingredient}, {observe: 'response'});
  }

  deleteIngredient(ingredient: any) {
    return this._http.post(`${this.baseUrl}/deleteIngredient`, {ingredient}, {observe: 'response'});
  }

  getComments = (): Observable<Comment[]> => {
    return this._http.get<Comment[]>(`${this.baseUrl}/getComments`)
      .pipe(
        tap(_ => console.log('load getAllComment'))
      );
  };
}
