import { Component, OnInit, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { Helpers } from "../../../helpers";
// import './header-nav.style.scss';
declare let mLayout: any;
@Component({
  selector: "app-header-nav",
  templateUrl: "./header-nav.component.html",
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["./header-nav.style.scss"]
})
export class HeaderNavComponent implements OnInit, AfterViewInit {
  public user: any;
  constructor() {
    this.user = JSON.parse(localStorage.getItem("currentUser"));
  }
  ngOnInit() {}
  ngAfterViewInit() {
    mLayout.initHeader();
  }
}
