import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

export default class WebControl {
   static httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
   };

   //export const baseURL = 'https://mysterious-atoll-89393.herokuapp.com/api/';
   static baseURL = 'http://localhost:4200/api/';
}
