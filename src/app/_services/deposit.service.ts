import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import webControl from "./webControl";
import { Deposit } from '../_models/deposit.model';
import { Subject } from 'rxjs';

@Injectable()
export class DepositService {

  listAirportsChanged = new Subject<Deposit[]>()
  private listDeposits: Deposit[] = []
  private endPoint: string = 'Deposits'

  constructor(private http: HttpClient) { }

  getDeposits() {
    return this.listDeposits
  }

  loadData() {
    this.http.get(webControl.baseURL + this.endPoint).subscribe(
      res => {
        console.log(res);
        this.listAirportsChanged.next(res as Deposit[])
      }
    )
  }

  getDepositsObservable() {
    return this.http.get(webControl.baseURL + this.endPoint)
  }

  getDepositsInclude() {
    return this.http.get(webControl.baseURL + this.endPoint + '/Deposits-included')
  }

  postDeposits(deposit) {
    const body = deposit
    return this.http.post(webControl.baseURL + this.endPoint, body, webControl.httpOptions)
  }

  deleteDeposit(id) {
    return this.http.delete(`${webControl.baseURL}${this.endPoint}/${id}`)
  }

  putDeposits(deposit) {
    const body = deposit
    return this.http.put(`${webControl.baseURL}${this.endPoint}/${body.id}`, body, webControl.httpOptions)
  }
}
