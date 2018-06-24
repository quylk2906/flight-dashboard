import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import WebControl from "./base";

@Injectable()

export class AgencyService {

  constructor(private http: HttpClient) { }

  getAgenciess() {
    return this.http.get(WebControl.baseURL + 'Agencies')
  }
  getAgenciesInclude() {
    return this.http.get(WebControl.baseURL + 'Agency/Agencies-included')
  }

  postAgencies(Agency) {
    const body = Agency
    return this.http.post(WebControl.baseURL + 'Agencies', body, WebControl.httpOptions)
  }

  deleteAgency(id) {
    return this.http.delete(`${WebControl.baseURL}Agencies/${id}`)
  }

  putAgencies(Agency) {
    const body = Agency
    return this.http.put(`${WebControl.baseURL}Agencies/${body.id}`, body, WebControl.httpOptions)
  }
}
