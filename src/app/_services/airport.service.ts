import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import webControl from "./webControl";
import { Observable, Subject } from 'rxjs';
import { Airport } from "../_models/airport.model";

@Injectable()
export class AirportService {
  listAirportsChanged = new Subject<Airport[]>()
  private listAirports: Airport[] = []
  private endPoint: string = 'Airports'
  constructor(private http: HttpClient) { }
  getAirports() {
    return this.listAirports
  }

  loadData() {
    this.http.get(webControl.baseURL + this.endPoint).subscribe(
      res => {
        this.listAirportsChanged.next(res as Airport[])
      }
    )
  }

  getAirportsObservable() {
    return this.http.get(webControl.baseURL + this.endPoint)
  }


  postAirport(airport) {
    const body = airport
    return this.http.post(webControl.baseURL + this.endPoint, body, webControl.httpOptions)
  }

  deleteAirport(id) {
    return this.http.delete(`${webControl.baseURL}${this.endPoint}/${id}`)
  }

  putAirport(airport) {
    const body = airport
    return this.http.put(`${webControl.baseURL}${this.endPoint}/${body.id}`, body, webControl.httpOptions)
  }
}
