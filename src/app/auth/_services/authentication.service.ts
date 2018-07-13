import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import "rxjs/add/operator/map";
import webControl from '../../_services/webControl';
import { Router } from "@angular/router";
import { Helpers } from "../../helpers";
// import { Response } from "@angular/http";

@Injectable()
export class AuthenticationService {

	constructor(private http: HttpClient, private _router: Router) {
	}

	login(email: string, password: string) {
		const body = { email, password }

		Helpers.setLoading(true);
		return this.http.post(webControl.baseURL + 'accounts/auth/signIn', body, webControl.httpOptions).map(
			(res: any) => {
				Helpers.setLoading(false);
				if (res.data.user && res.data.token) {
					res.data.user.token = res.data.token
					localStorage.setItem('currentUser', JSON.stringify(res.data.user));
					this._router.navigate(['/'])
				}
			}
		)
	}

	logout() {
		// remove user from local storage to log user out
		localStorage.removeItem('currentUser');
	}
}