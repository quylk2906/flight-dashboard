import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import webControl from "./webControl";
import { Subject } from 'rxjs/Subject';
import { ClientTicket } from '../_models/client-ticket.model';

@Injectable()
export class ClientTicketService {
  listClientTicketsChanged = new Subject<ClientTicket[]>()
  private listClientTickets: ClientTicket[] = []

  constructor(private http: HttpClient) { }

  getClients() {
    return this.listClientTickets
  }

  loadData() {
    this.http.get(webControl.baseURL + 'ClientTickets').subscribe(
      res => {
        this.listClientTicketsChanged.next(res as ClientTicket[])
      }
    )
  }

  getClientsIncluded() {
    return this.http.get(webControl.baseURL + 'ClientTickets/ClientTickets-included')
  }

  postClient(client) {
    const body = client
    return this.http.post(webControl.baseURL + 'ClientTickets', body, webControl.httpOptions)
  }

  deleteClient(id) {
    return this.http.delete(`${webControl.baseURL}ClientTickets/${id}`)
  }

  putClient(client) {
    const body = client
    return this.http.put(`${webControl.baseURL}ClientTickets/${body.id}`, body, webControl.httpOptions)
  }
}
