import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { CookieService } from 'ngx-cookie-service';
import { map } from 'rxjs/operators';

import { Router } from "@angular/router";
import { catchError } from "rxjs/internal/operators";
import { LoginServiceService } from '../service/login-service.service';
/*
The JWT interceptor intercepts the incoming requests from the application/user and adds JWT token to the request's Authorization header, only if the user is logged in.
This JWT token in the request header is required to access the SECURE END API POINTS on the server
*/

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private cookie: CookieService, private router: Router, private loginService: LoginServiceService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string = this.cookie.get('token');
    if (token) {
      request = request.clone({ headers: request.headers.set('x-access-token', token) });
    } else {

      request = request.clone({ headers: request.headers.set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlNzBlZDQ3NDUwNjEyMTViODhjNjFhNCIsImlhdCI6MTU4NDQ1OTA3OSwiZXhwIjoxNTg0NTQ1NDc5fQ.gE-4nDkfQCUXiq1_Vuppe523MY8L6oey4jcnNawm1vk') });

    }
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // const objectId = this.cookie.get('ObjectId');
    // if (objectId !== '') {

    //   request = request.clone({ headers: request.headers.set('x-access-user', objectId) });

    // } else {
    //   request = request.clone({ headers: request.headers.set('x-access-user', '5ea33fbb5d26160714313a74') });

    // }
    if (!request.headers.has('Content-Type')) {
      request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
    }

    request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

    return next.handle(request).pipe(catchError((error, caught) => {
      //intercept the respons error and displace it to the console
      console.log(error);
      this.handleAuthError(error);
      return of(error);
    }) as any);

  }
  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    //handle your auth error or rethrow
    console.log(err.status)
    if (err.status === 401) {
      //navigate /delete cookies or whatever
      console.log('handled error ' + err.status);
      this.loginService.logoutUser();
      window.location.reload();
      // if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
      return of(err.message);
    }
    throw err;
  }
  // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   // check if the current user is logged in
  //   // if the user making the request is logged in, he will have JWT token in it's local storage, which is set by Authorization Service during login process
  //   let currentUser = JSON.parse(this.cookie.get('token'));
  //   if (currentUser && currentUser.token) {
  //     // clone the incoming request and add JWT token in the cloned request's Authorization Header
  //     request = request.clone({
  //       setHeaders: {
  //         'authorization': `Bearer ${currentUser.token}`,
  //         'x-access-token': `${currentUser.token}`,
  //       }
  //     });
  //   }

  //   // handle any other requests which went unhandled
  //   return next.handle(request);
  // }
}
