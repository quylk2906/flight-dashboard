import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import "rxjs/add/operator/map";
import webControl from "../../_services/webControl";
import { Router } from "@angular/router";
import { Helpers } from "../../helpers";
// import { Response } from "@angular/http";

@Injectable()
export class AuthenticationService {
  constructor(private http: HttpClient, private _router: Router) {}

  login(email: string, password: string) {
    const body = { email, password };

    Helpers.setLoading(true);
    return this.http
      .post(webControl.baseURL + "accounts/auth/signIn", body, {
        headers: new HttpHeaders({ "Content-Type": "application/json", "No-auth": "true" })
      })
      .map((res: any) => {
        Helpers.setLoading(false);
        console.log(res.data.user);
        if (res.data.user && res.data.token) {
          if (!res.data.user.root) {
            delete res.data.user["root"];
          }
          localStorage.setItem("currentUser", JSON.stringify(res.data.user));
          localStorage.setItem("token", res.data.token);
          this._router.navigate(["/"]);
        }
      });
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
  }
}
