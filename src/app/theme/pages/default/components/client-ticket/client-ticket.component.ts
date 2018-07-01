import { Component, OnInit, AfterViewInit, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Subject';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Subscription } from 'rxjs/Subscription';
import { Select2 } from 'select2';
import { Helpers } from '../../../../../helpers';
import { NgForm } from '@angular/forms';

import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { ClientService } from '../../../../../_services/client.service';
import { AirportService } from '../../../../../_services/airport.service';
import { ClientTicketService } from '../../../../../_services/client-ticket.service';
import { ToastrService } from 'ngx-toastr';

import { ClientTicket } from '../../../../../_models/client-ticket.model';
import { Airport } from '../../../../../_models/airport.model';
import { Client } from '../../../../../_models/client.model';
import { Airline } from '../../../../../_models/airline.module';
import { AirlineService } from '../../../../../_services/airline.service';
import { find, cloneDeep } from 'lodash';

@Component({
  selector: 'app-client-ticket',
  templateUrl: './client-ticket.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`.ticket-content > div {margin-bottom: 10px;}`]
})
export class ClientTicketComponent implements OnInit, OnDestroy, AfterViewInit {
  private subsArr: Subscription[]
  listAirports: Airport[]
  listAirlines: Airline[]
  listClients: Client[]
  list: ClientTicket[]
  listStatus: string[] = ['None', 'In Process', 'Approved', 'Rejected']
  isRequest: boolean = false
  isExport: boolean = false
  public modalItem: ClientTicket
  public currentItem: ClientTicket = {
    clientId: undefined,
    hangBay: undefined,
    soTien: undefined,
    maDatCho: undefined,
    maXuatVe: undefined,
    tinhTrangVe: 'None',
    sanBayDi_chieuDi: undefined,
    sanBayDen_chieuDi: undefined,
    sanBayDi_chieuVe: undefined,
    sanBayDen_chieuVe: undefined,
    gioBay_chieuDi: undefined,
    gioDen_chieuDi: undefined,
    gioBay_chieuVe: undefined,
    gioDen_chieuVe: undefined,
    ngayBay_chieuDi: undefined,
    ngayDen_chieuDi: undefined,
    ngayBay_chieuVe: undefined,
    ngayDen_chieuVe: undefined,
    id: undefined,
    createdAt: undefined,
    updatedAt: undefined
  }

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {
    responsive: true,
    pagingType: "full_numbers",
    columnDefs: [
    ],
    order: [[0, "desc"]]
  };
  dtTrigger = new Subject();


  constructor(private _script: ScriptLoaderService,
    private _serviceClient: ClientService,
    private _serviceAirport: AirportService,
    private _serviceClientTicket: ClientTicketService,
    private _serviceAirline: AirlineService,
    private _toastr: ToastrService
  ) { }

  ngOnInit() {
    this.subsArr = []
    Helpers.setLoading(true)

    this.list = this._serviceClientTicket.getClients()
    this._serviceClientTicket.loadData()

    const sub1 = this._serviceClientTicket.listClientTicketsChanged.subscribe(
      rs => {
        this.list = rs
        console.log(rs);
        this.rerender()
      },
      err => {
        console.log(err);
      })

    const airportApi = this._serviceAirport.getAirportsObservable()
    const clientApi = this._serviceClient.getClientsObservable()
    const airlineApi = this._serviceAirline.getAirlinesObservable()
    const sub2 = forkJoin(airportApi, airlineApi, clientApi).subscribe(
      res => {
        console.log('object', res);
        this.listAirports = res[0] as Airport[]
        this.listAirlines = res[1] as Airline[]
        this.listClients = res[2] as Client[]
        this.loadScript()
      },
      err => {
        console.log(err);
      })

    this.subsArr.push(sub1)
    this.subsArr.push(sub2)

  }

  onSubmit(form: NgForm) {
    // if (form.invalid) {
    //   return
    // }
    Helpers.setLoading(true)
    console.log(form.value);
    const client = form.value as ClientTicket
    client.tinhTrangVe = 'None'
    client.gioBay_chieuDi = $('#m_datetimepicker_1_1').val().toString()
    client.gioDen_chieuDi = $('#m_datetimepicker_1_2').val().toString()
    client.ngayBay_chieuDi = $('#m_datetimepicker_1_1').val().toString()
    client.ngayDen_chieuDi = $('#m_datetimepicker_1_2').val().toString()

    client.gioBay_chieuVe = $('#m_datetimepicker_1_3').val().toString()
    client.gioDen_chieuVe = $('#m_datetimepicker_1_4').val().toString()
    client.ngayBay_chieuVe = $('#m_datetimepicker_1_3').val().toString()
    client.ngayDen_chieuVe = $('#m_datetimepicker_1_4').val().toString()

    client.clientId = $("#m_select2_4_1").val().toString()
    client.sanBayDi_chieuDi = $("#m_select2_4_2").val().toString()
    client.sanBayDen_chieuDi = $("#m_select2_4_3").val().toString()
    client.sanBayDi_chieuVe = $("#m_select2_4_4").val().toString()
    client.sanBayDen_chieuVe = $("#m_select2_4_5").val().toString()
    client.hangBay = $("#m_select2_4_6").val().toString()

    let subs: Subscription
    if (this.currentItem.id) {
      subs = this._serviceClientTicket.putClient(client).subscribe(
        rs => {
          this._serviceClientTicket.loadData()
          form.resetForm()
          this._toastr.info('Thay đổi thành công', undefined, { closeButton: true });
        },
        err => {
          Helpers.setLoading(false);
          this._toastr.error(err.error.error.message, undefined, { closeButton: true });
        }
      )
    } else {
      subs = this._serviceClientTicket.postClient(client).subscribe(
        rs => {
          this._toastr.info('Thêm thành công', undefined, { closeButton: true });
          this._serviceClientTicket.loadData()
          form.resetForm()
        },
        err => {
          Helpers.setLoading(false);
          this._toastr.error(err.error.error.message, undefined, { closeButton: true });
        }
      )
    }
    this.subsArr.push(subs)
  }

  ngAfterViewInit() {
    this._script.loadScripts('app-client-ticket',
      [
        'assets/vendors/custom/datatables/datatables.bundle.js',
        'assets/demo/default/custom/crud/datatables/basic/paginations.js',
        'assets/demo/default/custom/crud/forms/validation/form-controls.js',
        'assets/demo/default/custom/crud/forms/widgets/bootstrap-datetimepicker.js'
      ]);
    this.dtTrigger.next();
  }

  loadScript() {
    const dataAirport = this.listAirports.map(item => {
      return { id: item.airportCode, text: item.airportName }
    })
    const dataAirline = this.listAirlines.map(item => {
      return { id: item.id, text: item.airlineName }
    })
    const dataClient = this.listClients.map(item => {
      return { id: item.id, text: item.fullName }
    })
    $("#m_select2_4_1").select2({ data: dataClient })
    $("#m_select2_4_2").select2({ data: dataAirport })
    $("#m_select2_4_3").select2({ data: dataAirport })
    $("#m_select2_4_4").select2({ data: dataAirport })
    $("#m_select2_4_5").select2({ data: dataAirport })
    $("#m_select2_4_6").select2({ data: dataAirline })

    this._script.loadScripts('app-client-ticket',
      [
        'assets/demo/default/custom/crud/forms/widgets/select2.js'
      ]);
  }

  ngOnDestroy() {
    this.subsArr.forEach(sub => sub.unsubscribe())
    this.dtTrigger.unsubscribe();
  }

  rerender() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
      Helpers.setLoading(false)
    });
  }

  onRequestClick(id) {
    this.isRequest = true
    this.modalItem = find(this.list, (item) => { return item.id == id })

  }
  onViewClick(id) {
    this.modalItem = find(this.list, (item) => { return item.id == id })
  }
  onExportClick(id) {
    this.isExport = true
    this.modalItem = find(this.list, (item) => { return item.id == id })
    this.PrintElem()
  }

  onRequest() {
    this.modalItem.tinhTrangVe = this.listStatus[1]
    const sub = this._serviceClientTicket.putClient(this.modalItem).subscribe(rs => {
      // this._serviceClientTicket.loadData()
    })
    this.subsArr.push(sub)
  }

  resetState() {
    this.isRequest = false
    this.isExport = false
  }

  PrintElem() {
    let printContents, popupWin;
    printContents = document.getElementById('ticket-content').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

}
