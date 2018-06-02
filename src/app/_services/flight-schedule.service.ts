import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class FlightScheduleService {

  private baseURL = 'https://vast-journey-12423.herokuapp.com/api/';

  constructor(private http: HttpClient) { }

  getFlightSchedules() {
    return this.http.get(this.baseURL + 'flightSchedules')
  }

  getFlightSchedulesIncluded() {
    return this.http.get(this.baseURL + 'flightSchedules/flightSchedules-included')
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
