import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
// @ts-ignore
import { Gallery } from '../model/gallery';
import { Observable } from 'rxjs';

import { AppSetting } from '../../appsetting'
import { callbackify } from 'util';
@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  headerOptions: any = null
  private baseUrl = AppSetting.BASE_SERVER_URL;

  constructor(private http: HttpClient) {
  }

  private log(message: string) {
    console.log('loi cookStep service' + message);
  }

  getGalleryies = (): Observable<Gallery[]> => {

    return this.http.get<Gallery[]>(`${this.baseUrl}/getGalleries`)
      .pipe(
        tap(_ => console.log('load Gallery'))
      );
  }
  getTopGalleryies = (): Observable<Gallery[]> => {

    return this.http.get<Gallery[]>(`${this.baseUrl}/getTopGalleries`)
      .pipe(
        tap(_ => console.log('load Gallery'))
      );
  }

  // tslint:disable-next-line:no-shadowed-variable
  createGallery(gallery: any) {
    return this.http.post(`${this.baseUrl}/createGallery`, {gallery: gallery}, {observe: 'response'});
  }

  findGallery(gallery: any) {
    return this.http.post(`${this.baseUrl}/findGallery`, {gallery: gallery}, {observe: 'response'});
  }

  addGallery(gallery: any) {
    return this.http.post(`${this.baseUrl}/addGallery`, {gallery: gallery}, {observe: 'response'});
  }

  galleryDetail = (id: string): Observable<Gallery> => {
    const url = `${this.baseUrl}/galleryDetail/${id}`;
    return this.http.get<Gallery>(url).pipe(
      tap(_ => console.log('Gallery'))
    );
  }

  updateGallery(gallery: any) {
    return this.http.post(`${this.baseUrl}/updateGallery`, {gallery}, {observe: 'response'});
  }

  deleteGallery(gallery: any) {
    return this.http.post(`${this.baseUrl}/deleteGallery`, {gallery: gallery}, {observe: 'response'});
  }
}
