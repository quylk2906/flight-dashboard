import { HttpHeaders } from "@angular/common/http";
export default class WebControl {
  static httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };

  static baseURL = "https://vast-journey-12423.herokuapp.com/api/v1/";

  // static baseURL = "http://localhost:4200/api/v1/";
}
