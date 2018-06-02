import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()

export class FlightService {

  private baseURL = 'https://vast-journey-12423.herokuapp.com/api/';

  constructor(private http: HttpClient) { }

  getFlights() {
    return this.http.get(this.baseURL + 'flights')
  }
  getFlightInclude() {
    return this.http.get(this.baseURL + 'flights/flights-included')
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
