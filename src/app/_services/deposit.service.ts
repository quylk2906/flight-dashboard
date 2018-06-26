import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import webControl from "./webControl";

@Injectable()

export class DepositService {

  constructor(private http: HttpClient) { }

  getDeposits() {
    return this.http.get(webControl.baseURL + 'Deposits')
  }
  getDepositsInclude() {
    return this.http.get(webControl.baseURL + 'Deposits/Deposits-included')
  }

  postDeposits(deposit) {
    const body = deposit
    return this.http.post(webControl.baseURL + 'Deposits', body, webControl.httpOptions)
  }

  deleteAgency(id) {
    return this.http.delete(`${webControl.baseURL}Deposits/${id}`)
  }

  putDeposits(deposit) {
    const body = deposit
    return this.http.put(`${webControl.baseURL}Deposits/${body.id}`, body, webControl.httpOptions)
  }
}
