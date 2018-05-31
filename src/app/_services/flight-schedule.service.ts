import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class FlightScheduleService {
  private baseURL = 'https://mysterious-atoll-89393.herokuapp.com/api/';

  constructor(private http: HttpClient) { }

  getFlightSchedule() {
    return this.http.get(this.baseURL + 'flightSchedules')
  }

  postFlightSchedule(flightSchedule) {
    const body = flightSchedule
    return this.http.post(this.baseURL + 'flightSchedules', body, httpOptions)
  }

  deleteFlightSchedule(id) {
    return this.http.delete(`${this.baseURL}flightSchedules/${id}`)
  }

  putFlightSchedule(flightSchedule) {
    const body = flightSchedule
    return this.http.put(`${this.baseURL}flightSchedules/${body.id}`, body, httpOptions)
  }
}
