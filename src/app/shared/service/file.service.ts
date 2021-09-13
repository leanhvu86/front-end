import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import * as io from 'socket.io-client';
import {AppSetting} from 'src/app/appsetting';
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {
  }

  upload(file: File) {
    const formData: FormData = new FormData();

    formData.append('image', file);

    // const req = new HttpRequest('post', `${this.baseUrl}/api/upload`, formData, {
    //   reportProgress: true,
    //   responseType: 'json',
    //   headers: new HttpHeaders({
    //     'Content-Type': 'multipart/form-data; boundary=------WebKitFormBoundaryg7okV37G7Gfll2hf--' // 👈
    //   })
    // });
    return this.http.post(`${this.baseUrl}/api/upload`, formData, {
      reportProgress: true,
      responseType: 'json',
      headers: {
        'Content-Type': 'multipart/form-data; boundary=------WebKitFormBoundaryg7okV37G7Gfll2hf--'
      }
    });

    // return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }
}
