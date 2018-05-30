import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const baseURL = 'https://mysterious-atoll-89393.herokuapp.com/api/';

@Injectable()
export class FlightService {

  constructor(private http: HttpClient) { }

}
