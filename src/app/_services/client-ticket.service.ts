import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import WebControl from "./base";
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
    this.http.get(WebControl.baseURL + 'ClientTickets').subscribe(
      res => {
        this.listClientTicketsChanged.next(res as ClientTicket[])
      }
    )
  }

  getClientsIncluded() {
    return this.http.get(WebControl.baseURL + 'ClientTickets/ClientTickets-included')
  }

  postClient(client) {
    const body = client
    return this.http.post(WebControl.baseURL + 'ClientTickets', body, WebControl.httpOptions)
  }

  deleteClient(id) {
    return this.http.delete(`${WebControl.baseURL}ClientTickets/${id}`)
  }

  putClient(client) {
    const body = client
    return this.http.put(`${WebControl.baseURL}ClientTickets/${body.id}`, body, WebControl.httpOptions)
  }
}
