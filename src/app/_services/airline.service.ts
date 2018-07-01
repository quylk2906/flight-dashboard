import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import webControl from "./webControl";
import { Observable, Subject } from 'rxjs';
import { Airline } from '../_models/airline.module';

@Injectable()
export class AirlineService {
  listAirlinesChanged = new Subject<Airline[]>()
  private listAirlines: Airline[] = []
  private endPoint: string = 'Airlines'
  constructor(private http: HttpClient) { }

  getAirlines() {
    return this.listAirlines
  }

  loadData() {
    this.http.get(webControl.baseURL + this.endPoint).subscribe(
      res => {
        this.listAirlinesChanged.next(res as Airline[])
      }
    )
  }

  getAirlinesObservable() {
    return this.http.get(webControl.baseURL + this.endPoint)
  }

  postAirline(airline) {
    const body = airline
    return this.http.post(webControl.baseURL + this.endPoint, body, webControl.httpOptions)
  }

  deleteAirline(id) {
    return this.http.delete(`${webControl.baseURL}${this.endPoint}/${id}`)
  }

  putAirline(airline) {
    const body = airline
    return this.http.put(`${webControl.baseURL}${this.endPoint}/${body.id}`, body, webControl.httpOptions)
  }
}
