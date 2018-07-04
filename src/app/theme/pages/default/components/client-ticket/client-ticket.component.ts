import {
  Component,
  OnInit,
  AfterViewInit,
  ViewEncapsulation,
  OnDestroy,
  ViewChild
} from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs/Subject";
import { forkJoin } from "rxjs/observable/forkJoin";
import { Subscription } from "rxjs/Subscription";
import { Select2 } from "select2";
import { Helpers } from "../../../../../helpers";
import { NgForm } from "@angular/forms";

import { ScriptLoaderService } from "../../../../../_services/script-loader.service";
import { ClientService } from "../../../../../_services/client.service";
import { AirportService } from "../../../../../_services/airport.service";
import { ClientTicketService } from "../../../../../_services/client-ticket.service";
import { ToastrService } from "ngx-toastr";

import { ClientTicket } from "../../../../../_models/client-ticket.model";
import { Airport } from "../../../../../_models/airport.model";
import { Client } from "../../../../../_models/client.model";
import { Airline } from "../../../../../_models/airline.module";
import { AirlineService } from "../../../../../_services/airline.service";
import { find, cloneDeep } from "lodash";
import randomstring from "randomstring-ng";
import { AgencyService } from "../../../../../_services/agency.service";
import { Agency } from "../../../../../_models/agency.model";
@Component({
  selector: "app-client-ticket",
  templateUrl: "./client-ticket.component.html",
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .ticket-content > div {
        margin-bottom: 10px;
      }
    `
  ]
})
export class ClientTicketComponent implements OnInit, OnDestroy, AfterViewInit {
  private subsArr: Subscription[];
  listAirports: Airport[];
  listAirlines: Airline[];
  listClients: Client[];
  listAgencies: Agency[];
  list: ClientTicket[];
  listStatus: string[] = ["None", "In Process", "Approved", "Rejected"];
  isRequest: boolean = false;
  isExport: boolean = false;
  public modalItem: ClientTicket;
  public currentItem: ClientTicket = {
    clientId: undefined,
    agencyId: undefined,
    ticketId: undefined,
    hangBay: undefined,
    soTien: undefined,
    maDatCho: undefined,
    maXuatVe: undefined,
    tinhTrangVe: "None",
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

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {
    responsive: true,
    pagingType: "full_numbers",
    columnDefs: [],
    order: [[0, "desc"]]
  };
  dtTrigger = new Subject();

  constructor(
    private _script: ScriptLoaderService,
    private _serviceClient: ClientService,
    private _serviceAirport: AirportService,
    private _serviceClientTicket: ClientTicketService,
    private _serviceAirline: AirlineService,
    private _serviceAgency: AgencyService,
    private _toastr: ToastrService
  ) {}

  ngOnInit() {
    this.subsArr = [];

    Helpers.setLoading(true);

    // this.currentItem.maDatCho = randomstring.generate(6);
    this.list = this._serviceClientTicket.getClients();
    this._serviceClientTicket.loadData();

    const sub1 = this._serviceClientTicket.listClientTicketsChanged.subscribe(
      rs => {
        this.list = rs;
        console.log(rs);
        this.rerender();
      },
      err => {
        console.log(err);
      }
    );

    const airportApi = this._serviceAirport.getAirportsObservable();
    const clientApi = this._serviceClient.getClientsObservable();
    const airlineApi = this._serviceAirline.getAirlinesObservable();
    const agencyApi = this._serviceAgency.getAgenciesObservable();

    const sub2 = forkJoin(
      airportApi,
      airlineApi,
      clientApi,
      agencyApi
    ).subscribe(
      res => {
        console.log("object", res);
        this.listAirports = res[0]["data"] as Airport[];
        this.listAirlines = res[1]["data"] as Airline[];
        this.listClients = res[2]["data"] as Client[];
        this.listAgencies = res[3]["data"] as Agency[];
        this.loadScript();
      },
      err => {
        console.log(err);
      }
    );

    this.subsArr.push(sub1);
    this.subsArr.push(sub2);
  }

  onDelete(id) {
    Helpers.setLoading(true);
    const sub = this._serviceClientTicket.deleteClient(id).subscribe(rs => {
      if (rs["count"] !== 0) {
        this._toastr.info("Xóa thành công", undefined, { closeButton: true });
        this._serviceClientTicket.loadData();
      }
    });
    this.subsArr.push(sub);
  }

  onSubmit(form: NgForm) {
    // if (form.invalid) {
    //   return
    // }
    Helpers.setLoading(true);
    // const client = form.value as ClientTicket
    const client = this.currentItem;
    console.log(client);
    client.tinhTrangVe = "None";
    client.ngayGioBay_chieuDi = $("#m_datetimepicker_1_1")
      .val()
      .toString();
    client.ngayGioDen_chieuDi = $("#m_datetimepicker_1_2")
      .val()
      .toString();
    client.ngayGioBay_chieuVe = $("#m_datetimepicker_1_3")
      .val()
      .toString();
    client.ngayGioDen_chieuVe = $("#m_datetimepicker_1_4")
      .val()
      .toString();

    client.clientId = $("#m_select2_4_1")
      .val()
      .toString();
    client.sanBayDi_chieuDi = $("#m_select2_4_2")
      .val()
      .toString();
    client.sanBayDen_chieuDi = $("#m_select2_4_3")
      .val()
      .toString();
    client.sanBayDi_chieuVe = $("#m_select2_4_4")
      .val()
      .toString();
    client.sanBayDen_chieuVe = $("#m_select2_4_5")
      .val()
      .toString();
    client.hangBay = $("#m_select2_4_6")
      .val()
      .toString();

    let subs: Subscription;

    if (this.currentItem._id) {
      subs = this._serviceClientTicket.putClient(client).subscribe(
        rs => {
          this._serviceClientTicket.loadData();
          form.resetForm();
          this._toastr.info("Thay đổi thành công", undefined, {
            closeButton: true
          });
          this.clearSelect2();
        },
        err => {
          Helpers.setLoading(false);
          this._toastr.error(err.error.msg, undefined, {
            closeButton: true
          });
        }
      );
    } else {
      subs = this._serviceClientTicket.postClient(client).subscribe(
        rs => {
          this._toastr.info("Thêm thành công", undefined, {
            closeButton: true
          });
          this._serviceClientTicket.loadData();
          form.resetForm();
          this.clearSelect2();
        },
        err => {
          Helpers.setLoading(false);
          this._toastr.error(err.error.msg, undefined, {
            closeButton: true
          });
        }
      );
    }

    this.subsArr.push(subs);
  }

  clearSelect2() {
    $("#m_select2_4_1")
      .val(0)
      .trigger("change");
    $("#m_select2_4_2")
      .val(0)
      .trigger("change");
    $("#m_select2_4_3")
      .val(0)
      .trigger("change");
    $("#m_select2_4_4")
      .val(0)
      .trigger("change");
    $("#m_select2_4_5")
      .val(0)
      .trigger("change");
    $("#m_select2_4_6")
      .val(0)
      .trigger("change");
  }

  ngAfterViewInit() {
    this._script.loadScripts("app-client-ticket", [
      "assets/vendors/custom/datatables/datatables.bundle.js",
      "assets/demo/default/custom/crud/datatables/basic/paginations.js",
      "assets/demo/default/custom/crud/forms/validation/form-controls.js",
      "assets/demo/default/custom/crud/forms/widgets/bootstrap-datetimepicker.js"
    ]);
    this.dtTrigger.next();
  }

  loadScript() {
    const dataAirport = this.listAirports.map(item => {
      return { id: item.airportCode, text: item.airportName };
    });
    const dataAirline = this.listAirlines.map(item => {
      return { id: item._id, text: item.airlineName };
    });
    const dataClient = this.listClients.map(item => {
      return { id: item._id, text: item.fullName };
    });
    $("#m_select2_4_1").select2({ data: dataClient });
    $("#m_select2_4_2").select2({ data: dataAirport });
    $("#m_select2_4_3").select2({ data: dataAirport });
    $("#m_select2_4_4").select2({ data: dataAirport });
    $("#m_select2_4_5").select2({ data: dataAirport });
    $("#m_select2_4_6").select2({ data: dataAirline });

    this._script.loadScripts("app-client-ticket", [
      "assets/demo/default/custom/crud/forms/widgets/select2.js"
    ]);
  }

  ngOnDestroy() {
    this.subsArr.forEach(sub => sub.unsubscribe());
    this.dtTrigger.unsubscribe();
  }

  rerender() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
      Helpers.setLoading(false);
    });
  }

  onRequestClick(id) {
    this.isRequest = true;
    this.modalItem = find(this.list, item => {
      return item._id == id;
    });
  }
  onViewClick(id) {
    this.modalItem = find(this.list, item => {
      return item._id == id;
    });
  }
  onExportClick(id) {
    this.isExport = true;
    this.modalItem = find(this.list, item => {
      return item._id == id;
    });
    this.PrintElem();
  }

  onRequest() {
    this.modalItem.tinhTrangVe = this.listStatus[1];
    const sub = this._serviceClientTicket
      .putClient(this.modalItem)
      .subscribe(rs => {
        // this._serviceClientTicket.loadData()
      });
    this.subsArr.push(sub);
  }

  resetState() {
    this.isRequest = false;
    this.isExport = false;
  }

  PrintElem() {
    let printContents, popupWin;
    printContents = document.getElementById("ticket-content").innerHTML;
    popupWin = window.open("", "_blank", "top=0,left=0,height=100%,width=auto");
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`);
    popupWin.document.close();
  }
}
