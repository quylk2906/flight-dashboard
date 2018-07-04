import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import webControl from "./webControl";
import { Account } from "../_models/account.model";
import { Subject } from "rxjs";

@Injectable()
export class AccountService {
  private endPoint: string = "accounts";
  listAccountshanged = new Subject<Account[]>();
  private listAccounts: Account[] = [];

  constructor(private http: HttpClient) {}

  getAccounts() {
    return this.listAccounts;
  }

  loadData() {
    this.http.get(webControl.baseURL + this.endPoint).subscribe(res => {
      this.listAccountshanged.next(res["data"] as Account[]);
    });
  }

  getAccountsInclude() {
    return this.http.get(webControl.baseURL + "Accounts/Accounts-included");
  }

  getAirportsObservable() {
    return this.http.get(webControl.baseURL + this.endPoint);
  }

  postAccount(agency) {
    const body = agency;
    return this.http.post(
      webControl.baseURL + this.endPoint,
      body,
      webControl.httpOptions
    );
  }

  deletetAccount(id) {
    return this.http.delete(`${webControl.baseURL}${this.endPoint}/${id}`);
  }

  putAccount(agency) {
    const body = agency;
    return this.http.put(
      `${webControl.baseURL}${this.endPoint}`,
      body,
      webControl.httpOptions
    );
  }
}
