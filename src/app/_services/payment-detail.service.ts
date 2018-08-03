import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import webControl from "./webControl";
import { PaymentDetail } from '../_models/payment-detail.model';
import { Subject } from 'rxjs';

@Injectable()

export class PaymentDetailService {

  private endPoint: string = 'paymentDetails'
  listPaymentChanged = new Subject<PaymentDetail[]>();
  private listPayment: PaymentDetail[] = [];
  constructor(private http: HttpClient) { }


  loadData() {
    this.http.get(webControl.baseURL + this.endPoint).subscribe(res => {
      this.listPaymentChanged.next(res["data"] as PaymentDetail[]);
    });
  }

  getPaymentDetailObservable() {
    return this.http.get(webControl.baseURL + this.endPoint)
  }

  getPaymentByCondition(data) {
    return this.http.post(webControl.baseURL + this.endPoint + '/findByCondition', data, webControl.httpOptions)
  }
  getClients() {
    return this.listPayment;
  }

  postPaymentDetails(paymentDetail) {
    const body = paymentDetail
    return this.http.post(webControl.baseURL + this.endPoint, body, webControl.httpOptions)
  }

  deleteAgency(id) {
    return this.http.delete(`${webControl.baseURL}${this.endPoint}/${id}`)
  }

  putPaymentDetails(paymentDetail) {
    const body = paymentDetail
    return this.http.put(`${webControl.baseURL}${this.endPoint}/${body.id}`, body, webControl.httpOptions)
  }
}
