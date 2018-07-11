import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import webControl from "./webControl";
import { Observable, Subject } from "rxjs";
import { Airport } from "../_models/airport.model";
const region = require('../_utils/tinh.json')
@Injectable()
export class AirportService {
  listAirportsChanged = new Subject<Airport[]>();
  private listAirports: Airport[] = [];
  private endPoint: string = "airports";
  constructor(private http: HttpClient) { }
  getAirports() {
    return this.listAirports;
  }

  getAllRegions() {
    let listRegions = []
    Object.entries(region).forEach(([key, value]) => {
      const obj = { name: value["name"], code: value["code"], slug: value["slug"] }
      listRegions.push(obj)
    })
    return listRegions
  }

  loadData() {
    this.http.get(webControl.baseURL + this.endPoint).subscribe(res => {
      this.listAirportsChanged.next(res["data"] as Airport[]);
    });
  }

  getAirportsObservable() {
    return this.http.get(webControl.baseURL + this.endPoint);
  }

  postAirport(airport) {
    const body = airport;
    return this.http.post(
      webControl.baseURL + this.endPoint,
      body,
      webControl.httpOptions
    );
  }

  deleteAirport(id) {
    return this.http.delete(`${webControl.baseURL}${this.endPoint}/${id}`);
  }

  putAirport(airport) {
    const body = airport;
    return this.http.put(
      `${webControl.baseURL}${this.endPoint}`,
      body,
      webControl.httpOptions
    );
  }
}
