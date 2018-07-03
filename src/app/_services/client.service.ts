import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import webControl from "./webControl";
import { Client } from "../_models/client.model";
import { Subject } from "rxjs/Subject";

@Injectable()
export class ClientService {
  listClientsChanged = new Subject<Client[]>();
  private listClients: Client[] = [];
  private endPoint: string = "clients";
  constructor(private http: HttpClient) {}

  getClients() {
    return this.listClients;
  }

  getClientsObservable() {
    return this.http.get(webControl.baseURL + this.endPoint);
  }

  loadData() {
    this.http.get(webControl.baseURL + this.endPoint).subscribe(res => {
      this.listClientsChanged.next(res["data"] as Client[]);
    });
  }

  // getClients() {
  //   return this.http.get(webControl.baseURL + 'Clients')
  // }

  getClientsIncluded() {
    return this.http.get(
      webControl.baseURL + this.endPoint + "/Clients-included"
    );
  }

  postClient(client) {
    const body = client;
    return this.http.post(
      webControl.baseURL + this.endPoint,
      body,
      webControl.httpOptions
    );
  }

  deleteClient(id) {
    return this.http.delete(`${webControl.baseURL}${this.endPoint}/${id}`);
  }

  putClient(client) {
    const body = client;
    return this.http.put(
      `${webControl.baseURL}${this.endPoint}/${body.id}`,
      body,
      webControl.httpOptions
    );
  }
}
