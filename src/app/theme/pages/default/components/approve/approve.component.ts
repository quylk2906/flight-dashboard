<<<<<<< HEAD
import { Component, OnInit, AfterViewInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { trimObjectAfterSave } from '../../../../../_utils/trimObject';
import { find } from 'lodash';
import { ObjectUnsubscribedError, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables';
import { ViewChild } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ClientTicket } from '../../../../../_models/client-ticket.model';
import { ClientTicketService } from '../../../../../_services/client-ticket.service';


import * as moment from 'moment';
=======
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewEncapsulation,
  OnDestroy
} from "@angular/core";
import { ScriptLoaderService } from "../../../../../_services/script-loader.service";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs/Subscription";
import { trimObjectAfterSave } from "../../../../../_utils/trimObject";
import { find } from "lodash";
import { ObjectUnsubscribedError, Subject } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { DataTableDirective } from "angular-datatables";
import { ViewChild } from "@angular/core";
import { Helpers } from "../../../../../helpers";
import { ClientTicket } from "../../../../../_models/client-ticket.model";
import { ClientTicketService } from "../../../../../_services/client-ticket.service";
>>>>>>> bc544f9ef1d07c2dfda74fc61296ffec4f6ccbc9

@Component({
  selector: "app-approve",
  templateUrl: "./approve.component.html",
  encapsulation: ViewEncapsulation.None,
  styles: []
})
export class ApproveComponent implements OnInit, OnDestroy, AfterViewInit {
<<<<<<< HEAD
  private subsArr: Subscription[]
  list: ClientTicket[]

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  private listStatus: string[] = ['None', 'In Process', 'Approved', 'Rejected']

  dtOptions: any = {
    responsive: true,
    pagingType: "full_numbers",
    columnDefs: [
    ],
    order: [[0, "desc"]],
=======
  private subsArr: Subscription[];
  list: ClientTicket[];
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  private listStatus: string[] = ["None", "In Process", "Approved", "Rejected"];
  dtOptions: DataTables.Settings = {
    responsive: true,
    pagingType: "full_numbers",
    columnDefs: [],
    order: [[0, "desc"]]
>>>>>>> bc544f9ef1d07c2dfda74fc61296ffec4f6ccbc9
  };
  dtTrigger = new Subject();
  public currentItem: ClientTicket = {
    clientId: undefined,
    agencyId: undefined,
    ticketId: undefined,
    maDatCho: undefined,
    maXuatVe: undefined,
    soTien: undefined,
    tinhTrangVe: undefined,
    hangBay: undefined,
    sanBayDi_chieuDi: undefined,
    sanBayDen_chieuDi: undefined,
    sanBayDi_chieuVe: undefined,
    sanBayDen_chieuVe: undefined,
    ngayGioBay_chieuDi: undefined,
    ngayGioDen_chieuDi: undefined,
    ngayGioBay_chieuVe: undefined,
    ngayGioDen_chieuVe: undefined,
    _id: undefined,
    createdAt: undefined,
    updatedAt: undefined
  };

  constructor(
    private _script: ScriptLoaderService,
    private _serviceClient: ClientTicketService,
    private _toastr: ToastrService
  ) {}

  ngOnInit() {
    this.subsArr = [];
    Helpers.setLoading(true);

<<<<<<< HEAD
    const sub = this._serviceClient.listClientTicketsChanged.subscribe(
      rs => {
        this.list = rs
        this.rerender()
      },
      err => {
        console.log(err);
      })

    this.subsArr.push(sub)
=======
    this.list = this._serviceClient.getClients();
    this._serviceClient.loadData();

    const sub1 = this._serviceClient.listClientTicketsChanged.subscribe(
      rs => {
        this.list = rs;
        console.log(rs);
        this.rerender();
      },
      err => {
        console.log(err);
      }
    );
>>>>>>> bc544f9ef1d07c2dfda74fc61296ffec4f6ccbc9
  }

  onShowModal(id) {
    this.currentItem = find(this.list, item => {
      return item._id == id;
    });
  }

  ngOnDestroy(): void {
    Helpers.setLoading(true);
    this.subsArr.forEach(sub => sub.unsubscribe());
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit() {
<<<<<<< HEAD
    this._script.loadScripts('app-approve',
      [
        'assets/vendors/custom/datatables/datatables.bundle.js',
        // 'assets/demo/default/custom/crud/datatables/extensions/buttons.js',
        // 'assets/demo/default/custom/crud/datatables/standard/paginations.js',
        // 'assets/demo/default/custom/crud/forms/validation/form-controls.js'
      ]);
=======
    this._script.loadScripts("app-approve", [
      "assets/vendors/custom/datatables/datatables.bundle.js",
      "assets/demo/default/custom/crud/datatables/standard/paginations.js",
      "assets/demo/default/custom/crud/forms/validation/form-controls.js"
    ]);
>>>>>>> bc544f9ef1d07c2dfda74fc61296ffec4f6ccbc9
    this.dtTrigger.next();
  }

  loadScript() {
    // const dataAgency = this.listAgencies.map(item => {
    //   return { id: item.agencyCode, text: item.agencyName }
    // })
    // $("#m_select2_4_1").select2({ data: dataAgency })
    // this._script.loadScripts('app-approve',
    //   [
    //     'assets/demo/default/custom/crud/forms/widgets/select2.js'
    //   ]);
  }

  // onSendEmail() {
  //   const sub =
  //   this.subsArr.push(sub);
  // }

  onApprove() {
<<<<<<< HEAD
    this.currentItem.tinhTrangVe = this.listStatus[2]
    const sub = this._serviceClient.changeStatus(this.currentItem).subscribe(rs => {
      console.log(rs);
    })
    this.subsArr.push(sub)
=======
    this.currentItem.tinhTrangVe = this.listStatus[2];
    const email = "quylk2906@gmail.com";
    let data = { ...this.currentItem } as any;
    data._user = "current_user";
    data.email = email;
    const sub = this._serviceClient
      .changeStatus(this.currentItem)
      .subscribe(rs => {
        return this._serviceClient.sendEmail(data).subscribe(
          rs => {
            console.log(rs);
          },
          err => {
            console.log(err);
          }
        );
      });
    this.subsArr.push(sub);
>>>>>>> bc544f9ef1d07c2dfda74fc61296ffec4f6ccbc9
  }

  onReject() {
    this.currentItem.tinhTrangVe = this.listStatus[3];
    const email = "quylk2906@gmail.com";
    let data = { ...this.currentItem } as any;
    data._user = "current_user";
    data.email = email;
    const sub = this._serviceClient
      .changeStatus(this.currentItem)
      .subscribe(rs => {
        return this._serviceClient.sendEmail(data).subscribe(
          rs1 => {
            console.log(rs1);
          },
          err => {
            console.log(err);
          }
        );
      });
    this.subsArr.push(sub);
  }

  rerender() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
      Helpers.setLoading(false);
    });
  }
}

