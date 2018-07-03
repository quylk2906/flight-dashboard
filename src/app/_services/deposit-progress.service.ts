import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import webControl from "./webControl";
import { Subject } from "rxjs/Subject";
import { DepositProgress } from "../_models/deposit-progress";

@Injectable()
export class Progresservice {
  listProgressChanged = new Subject<DepositProgress[]>();
  private listProgress: DepositProgress[] = [];
  private endPoint: string = "depositProgresses";

  constructor(private http: HttpClient) {}

  getProgress() {
    return this.listProgress;
  }

  getProgressObservable() {
    return this.http.get(webControl.baseURL + this.endPoint);
  }

  loadData() {
    this.http.get(webControl.baseURL + this.endPoint).subscribe(res => {
      this.listProgressChanged.next(res["data"] as DepositProgress[]);
    });
  }

  getProgressIncluded() {
    return this.http.get(
      webControl.baseURL + this.endPoint + "/Progress-included"
    );
  }

  postProgress(progress) {
    const body = progress;
    return this.http.post(
      webControl.baseURL + this.endPoint,
      body,
      webControl.httpOptions
    );
  }

  deleteProgress(id) {
    return this.http.delete(`${webControl.baseURL}${this.endPoint}/${id}`);
  }

  putProgress(progress) {
    const body = progress;
    return this.http.put(
      `${webControl.baseURL}${this.endPoint}`,
      body,
      webControl.httpOptions
    );
  }
}
