import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { RouteRail } from '../model/route-rail';
import { Observable } from 'rxjs';
import { callbackify } from 'util';
@Injectable({
  providedIn: 'root'
})
export class RouteRailService {
  headerOptions: any = null
  private baseUrl: string = 'http://localhost:8000';
  constructor(private _http: HttpClient) {
  }

  private log(message: string) {
    console.log('loi RouteRail service' + message);
  }

  getRouteRails = (): Observable<RouteRail[]> => {

    return this._http.get<RouteRail[]>(`${this.baseUrl}/routeRails`)
      .pipe(
        tap(_ => console.log('load RouteRail'))
      );
  }
}

