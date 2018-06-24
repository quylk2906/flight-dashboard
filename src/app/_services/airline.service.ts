import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import WebControl from "./base";

@Injectable()
export class AirlineService {

  constructor(private http: HttpClient) { }

  getAirline() {
    return this.http.get(WebControl.baseURL + 'Airlines')
  }

  postAirline(airline) {
    const body = airline
    return this.http.post(WebControl.baseURL + 'Airlines', body, WebControl.httpOptions)
  }

  deleteAirline(id) {
    return this.http.delete(`${WebControl.baseURL}Airlines/${id}`)
  }

  putAirline(airline) {
    const body = airline
    return this.http.put(`${WebControl.baseURL}Airlines/'${body.id}`, body, WebControl.httpOptions)
  }
}
