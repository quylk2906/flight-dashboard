import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import webControl from "./webControl";
import { Observable, Subject } from "rxjs";
import { Position } from "../_models/position.model";

@Injectable()
export class PositionService {
   listPositionsChanged = new Subject<Position[]>();
   private listPositions: Position[] = [];
   private endPoint: string = "divisions";

   constructor(private http: HttpClient) { }

   getPositions() {
      return this.listPositions;
   }


   loadData() {
      this.http.get(webControl.baseURL + this.endPoint).subscribe(res => {
         this.listPositionsChanged.next(res["data"] as Position[]);
      });
   }

   postPosition(position) {
      const body = position;
      return this.http.post(
         webControl.baseURL + this.endPoint,
         body,
         webControl.httpOptions
      );
   }

   deletePosition(id) {
      return this.http.delete(`${webControl.baseURL}${this.endPoint}/${id}`);
   }

   putPosition(position) {
      const body = position;
      return this.http.put(
         `${webControl.baseURL}${this.endPoint}`,
         body,
         webControl.httpOptions
      );
   }
}
