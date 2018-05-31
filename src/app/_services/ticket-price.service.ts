import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class TicketPriceService {


  private baseURL = 'https://mysterious-atoll-89393.herokuapp.com/api/';

  constructor(private http: HttpClient) { }

  getTicketPrice() {
    return this.http.get(this.baseURL + 'ticketPrices')
  }

  postTicketPrice(ticket) {
    const body = ticket
    return this.http.post(this.baseURL + 'ticketPrices', body, httpOptions)
  }

  deleteTicketPrice(id) {
    return this.http.delete(`${this.baseURL}ticketPrices/${id}`)
  }

  putTicketPrice(ticket) {
    const body = ticket
    return this.http.put(`${this.baseURL}ticketPrices/${body.id}`, body, httpOptions)
  }
}
