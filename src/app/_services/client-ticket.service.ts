import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import webControl from "./webControl";
import { Subject } from "rxjs/Subject";
import { ClientTicket } from "../_models/client-ticket.model";

@Injectable()
export class ClientTicketService {
  listClientTicketsChanged = new Subject<ClientTicket[]>();
  private listClientTickets: ClientTicket[] = [];
  private endPoint: string = "tickets";
  constructor(private http: HttpClient) {}

  getClients() {
    return this.listClientTickets;
  }

  loadData() {
    this.http.get(webControl.baseURL + this.endPoint).subscribe(res => {
      this.listClientTicketsChanged.next(res["data"] as ClientTicket[]);
    });
  }

  getClientsIncluded() {
    return this.http.get(webControl.baseURL + this.endPoint);
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
