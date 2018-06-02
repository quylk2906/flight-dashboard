import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()

export class FlightService {

  // private baseURL = 'https://mysterious-atoll-89393.herokuapp.com/api/';
  private baseURL = 'http://localhost:4200/api/';
  constructor(private http: HttpClient) { }

  getFlight() {
    return this.http.get(this.baseURL + 'flights')
  }

  postFlight(flight) {
    const body = flight
    return this.http.post(this.baseURL + 'flights', body, httpOptions)
  }

  deleteFlight(id) {
    return this.http.delete(`${this.baseURL}flights/${id}`)
  }

  putFlight(flight) {
    const body = flight
    return this.http.put(`${this.baseURL}flights/${body.id}`, body, httpOptions)
  }

}
