import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import webControl from "./webControl";

@Injectable()

export class AgencyService {

  constructor(private http: HttpClient) { }

  getAgenciess() {
    return this.http.get(webControl.baseURL + 'Agencies')
  }
  getAgenciesInclude() {
    return this.http.get(webControl.baseURL + 'Agency/Agencies-included')
  }

  postAgencies(Agency) {
    const body = Agency
    return this.http.post(webControl.baseURL + 'Agencies', body, webControl.httpOptions)
  }

  deleteAgency(id) {
    return this.http.delete(`${webControl.baseURL}Agencies/${id}`)
  }

  putAgencies(Agency) {
    const body = Agency
    return this.http.put(`${webControl.baseURL}Agencies/${body.id}`, body, webControl.httpOptions)
  }
}
