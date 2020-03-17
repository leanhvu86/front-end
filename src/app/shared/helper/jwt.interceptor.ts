import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { CookieService } from 'ngx-cookie-service';
import { map } from 'rxjs/operators';

/*
The JWT interceptor intercepts the incoming requests from the application/user and adds JWT token to the request's Authorization header, only if the user is logged in.
This JWT token in the request header is required to access the SECURE END API POINTS on the server
*/

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private cookie: CookieService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string = this.cookie.get('token');
    console.log('handle request' + token)
    if (token) {
      request = request.clone({ headers: request.headers.set('x-access-token', token) });
    } else {
      const tokens = sessionStorage.getItem('token')
      console.log(tokens)
      request = request.clone({ headers: request.headers.set('x-access-token', tokens) });
    }

    if (!request.headers.has('Content-Type')) {
      request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
    }

    request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log('event--->>>', event);
        }
        return event;
      }));
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
