import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import webControl from "./webControl";

@Injectable()

export class PaymentDetailService {

  constructor(private http: HttpClient) { }

  getPaymentDetails() {
    return this.http.get(webControl.baseURL + 'PaymentDetails')
  }
  getPaymentDetailsInclude() {
    return this.http.get(webControl.baseURL + 'PaymentDetails/PaymentDetails-included')
  }

  postPaymentDetails(paymentDetail) {
    const body = paymentDetail
    return this.http.post(webControl.baseURL + 'PaymentDetails', body, webControl.httpOptions)
  }

  deleteAgency(id) {
    return this.http.delete(`${webControl.baseURL}PaymentDetails/${id}`)
  }

  putPaymentDetails(paymentDetail) {
    const body = paymentDetail
    return this.http.put(`${webControl.baseURL}PaymentDetails/${body.id}`, body, webControl.httpOptions)
  }
}
