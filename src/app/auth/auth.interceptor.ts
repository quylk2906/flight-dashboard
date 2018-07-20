import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Router } from "@angular/router";

import "rxjs/add/operator/do";
import { Observable } from "rxjs-compat";
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.headers.get("No-auth") == "true") {
      return next.handle(req.clone());
    }
    let currentToken = localStorage.getItem("token");
    if (currentToken) {
      const clonedReq = req.clone({
        // headers: req.headers.set("Authorization", localStorage.getItem("token"))
        setHeaders: {
          Authorization: currentToken
        }
      });
      console.log(clonedReq);
      return next.handle(clonedReq).do(
        success => {
          console.log(success);
        },
        err => {
          console.log(err);
          if (err.status === 401) this.router.navigateByUrl("/login");
        }
      );
    } else {
      this.router.navigateByUrl("/login");
    }
  }
}
