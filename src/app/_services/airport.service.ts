import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AirportService {

  private baseURL = 'https://mysterious-atoll-89393.herokuapp.com/api/';

  constructor(private http: HttpClient) { }

  getAirport() {
    return this.http.get(this.baseURL + 'airports')
  }

  postAirport(airport) {
    const body = airport
    return this.http.post(this.baseURL + 'airports', body, httpOptions)
  }

  deleteAirport(id) {
    return this.http.delete(`${this.baseURL}airports/${id}`)
  }

  putAirport(airport) {
    const body = airport
    return this.http.put(`${this.baseURL}airports/'${body.id}`, body, httpOptions)
  }
}
