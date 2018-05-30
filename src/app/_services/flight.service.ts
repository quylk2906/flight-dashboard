import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
// https://mysterious-atoll-89393.herokuapp.com/api/
// delete: https://mysterious-atoll-89393.herokuapp.com/api/airlineAgents/5ad1a58ddb06140a94382cd9
// put: https://mysterious-atoll-89393.herokuapp.com/api/airlineAgents/5ad1a58ddb06140a94382cd9
const baseURL = '';

@Injectable()
export class FlightService {

  constructor(private http: HttpClient) { }

}
