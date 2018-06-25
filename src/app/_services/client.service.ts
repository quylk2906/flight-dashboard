import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import WebControl from "./base";
import { Client } from '../_models/client.model';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ClientService {
  listClientsChanged = new Subject<Client[]>()
  private listClients: Client[] = []

  constructor(private http: HttpClient) { }

  getClients() {
    return this.listClients
  }

  loadData() {
    this.http.get(WebControl.baseURL + 'Clients').subscribe(
      res => {
        this.listClientsChanged.next(res as Client[])
      }
    )
  }

  // getClients() {
  //   return this.http.get(WebControl.baseURL + 'Clients')
  // }

  getClientsIncluded() {
    return this.http.get(WebControl.baseURL + 'Clients/Clients-included')
  }

  postClient(client) {
    const body = client
    return this.http.post(WebControl.baseURL + 'Clients', body, WebControl.httpOptions)
  }

  deleteClient(id) {
    return this.http.delete(`${WebControl.baseURL}Clients/${id}`)
  }

  putClient(client) {
    const body = client
    return this.http.put(`${WebControl.baseURL}Clients/${body.id}`, body, WebControl.httpOptions)
  }
}
