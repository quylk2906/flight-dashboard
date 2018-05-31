import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable()
export class AirlineAgentService {
  private baseURL = 'https://mysterious-atoll-89393.herokuapp.com/api/';

  constructor(private http: HttpClient) { }

  getAirlineAgent() {
    return this.http.get(this.baseURL + 'airlineAgents')
  }

  postAirlineAgent(airlineAgent) {
    const body = airlineAgent
    return this.http.post(this.baseURL + 'airlineAgents', body, httpOptions)
  }

  deleteAirlineAgent(id) {
    return this.http.delete(`${this.baseURL}airlineAgents/${id}`)
  }

  putAirlineAgent(airlineAgent) {
    const body = airlineAgent
    return this.http.put(`${this.baseURL}airlineAgents/'${body.id}`, body, httpOptions)
  }
}
