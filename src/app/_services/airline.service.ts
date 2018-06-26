// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
// import webControl from "./webControl";

// @Injectable()
// export class AirlineService {

//   constructor(private http: HttpClient) { }

//   getAirline() {
//     return this.http.get(webControl.baseURL + 'Airlines')
//   }

//   postAirline(airline) {
//     const body = airline
//     return this.http.post(webControl.baseURL + 'Airlines', body, webControl.httpOptions)
//   }

//   deleteAirline(id) {
//     return this.http.delete(`${webControl.baseURL}Airlines/${id}`)
//   }

//   putAirline(airline) {
//     const body = airline
//     return this.http.put(`${webControl.baseURL}Airlines/ '${body.id}`, body, webControl.httpOptions)
//   }
// }
