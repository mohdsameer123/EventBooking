import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class InterceptohttpInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Get the user token from local storage
    const currentUserToken: any = localStorage.getItem(
      'user-token-goldBharatFirst'
    );
    const coreToken = JSON.parse(currentUserToken);
    // Clone the request to modify it
    let modifiedRequest = request;

    // If a user token exists, set the Authorization header
    if (coreToken) {
      modifiedRequest = request.clone({
        setHeaders: { Authorization: coreToken },
      });
    }

    // Pass the modified request to the next handler in the chain
    return next.handle(modifiedRequest);


  }
}

