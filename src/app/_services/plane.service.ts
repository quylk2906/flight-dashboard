import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class PlaneService {

  private baseURL = 'https://vast-journey-12423.herokuapp.com/api/';

  constructor(private http: HttpClient) { }

  getPlane() {
    return this.http.get(this.baseURL + 'planes')
  }

  postPlane(plane) {
    const body = plane
    return this.http.post(this.baseURL + 'planes', body, httpOptions)
  }

  deletePlane(id) {
    return this.http.delete(`${this.baseURL}planes/${id}`)
  }

  putPlane(plane) {
    const body = plane
    return this.http.put(`${this.baseURL}planes/${body.id}`, body, httpOptions)
  }
}
