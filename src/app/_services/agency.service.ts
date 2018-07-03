import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import webControl from "./webControl";
import { Agency } from "../_models/agency.model";
import { Subject } from "rxjs";

@Injectable()
export class AgencyService {
  private endPoint: string = "agencies";
  listAgencyhanged = new Subject<Agency[]>();
  private listAgencies: Agency[] = [];

  constructor(private http: HttpClient) {}

  getAgencies() {
    return this.listAgencies;
  }

  loadData() {
    this.http.get(webControl.baseURL + this.endPoint).subscribe(res => {
      this.listAgencyhanged.next(res["data"] as Agency[]);
    });
  }

  getAgenciesInclude() {
    return this.http.get(webControl.baseURL + "Agency/Agencies-included");
  }

  getAgenciesObservable() {
    return this.http.get(webControl.baseURL + this.endPoint);
  }

  postAgencies(agency) {
    const body = agency;
    return this.http.post(
      webControl.baseURL + this.endPoint,
      body,
      webControl.httpOptions
    );
  }

  deleteAgency(id) {
    return this.http.delete(`${webControl.baseURL}${this.endPoint}/${id}`);
  }

  putAgencies(agency) {
    const body = agency;
    return this.http.put(
      `${webControl.baseURL}${this.endPoint}`,
      body,
      webControl.httpOptions
    );
  }
}
