import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

export default class WebControl {
   static httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
   };

   //   static baseURL = 'https://vast-journey-12423.herokuapp.com/api/';

   static baseURL = 'http://localhost:4200/api/';
}
