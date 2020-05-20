import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // console.log('url ==> ', request.url);

    // if (!request.url.endsWith('user.json')) {
    //   const headers = request.headers.set("Content-Type", "application/json",);
    //   const newRequest = request.clone({headers});

    //   console.log(newRequest.headers);
    //   return next.handle(newRequest);
    // } else {
    //   return next.handle(request);
    // }
    if (!req.headers.has("Content-Type")) {
      req = req.clone({
        headers: req.headers.set("Content-Type", "application/json"),
      });
    }
    console.log(req.headers.get("Content-Type"));
    return next.handle(req);
  }
}
