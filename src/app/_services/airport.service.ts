import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import WebControl from "./base";
import { Observable, Subject } from 'rxjs';
import { Airport } from "../_models/airport.model";
@Injectable()
export class AirportService {
  listAirportsChanged = new Subject<Airport[]>()
  private listAirports: Airport[] = []
  constructor(private http: HttpClient) { }

  getAirports() {
    return this.listAirports
  }

  loadData() {
    this.http.get(WebControl.baseURL + 'Airports').subscribe(
      res => {
        this.listAirportsChanged.next(res as Airport[])
      }
    )
  }

  postAirport(airport) {
    const body = airport
    return this.http.post(WebControl.baseURL + 'Airports', body, WebControl.httpOptions)
  }

  deleteAirport(id) {
    return this.http.delete(`${WebControl.baseURL}Airports/${id}`)
  }

  putAirport(airport) {
    const body = airport
    return this.http.put(`${WebControl.baseURL}Airports/${body.id}`, body, WebControl.httpOptions)
  }
}
