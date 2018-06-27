import { Component, OnInit, AfterViewInit, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Subject';


import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { Airport } from '../../../../../_models/airport.model';
import { Client } from '../../../../../_models/client.model';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Subscription } from 'rxjs/Subscription';
import { ClientService } from '../../../../../_services/client.service';
import { AirportService } from '../../../../../_services/airport.service';
import { Select2 } from 'select2';
import { ClientTicket } from '../../../../../_models/client-ticket.model';
import { Helpers } from '../../../../../helpers';
import { ClientTicketService } from '../../../../../_services/client-ticket.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-client-ticket',
  templateUrl: './client-ticket.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: []
})
export class ClientTicketComponent implements OnInit, OnDestroy, AfterViewInit {
  private subsArr: Subscription[]
  listAirports: Airport[]
  listClients: Client[]
  list: ClientTicket[]
  listStatus: string[] = ['None', 'Pending', 'Approved', 'Rejected']
  public currentItem: ClientTicket = {
    clientId: undefined,
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
    private _serviceClientTicket: ClientTicketService) { }

  ngOnInit() {
    this.subsArr = []
    Helpers.setLoading(true)

    this.list = this._serviceClientTicket.getClients()
    this._serviceClientTicket.loadData()

    const subs1 = this._serviceClientTicket.listClientTicketsChanged.subscribe(
      rs => {
        this.list = rs
        this.rerender()
      },
      err => {
        console.log(err);
      })


    const airportApi = this._serviceAirport.getAirportsObservable()
    const clientApi = this._serviceClient.getClientsObservable()
    const subs2 = forkJoin(airportApi, clientApi).subscribe(
      res => {
        console.log('object', res);
        this.listClients = res[1] as Client[]
        this.listAirports = res[0] as Airport[]
        this.loadScript()
      },
      err => {
        console.log(err);
      })

    this.subsArr.push(subs1)
    this.subsArr.push(subs2)

  }

  onSubmit(form: NgForm) {
    // if (form.invalid) {
    //   return
    // }
    Helpers.setLoading(true)
    const client = form.value as ClientTicket
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

    console.log(client);
    let subs: Subscription
    if (this.currentItem.id) {
      subs = this._serviceClientTicket.putClient(client).subscribe(
        rs => {
          this._serviceClientTicket.loadData()
          form.resetForm()
        },
        err => { Helpers.setLoading(false); alert(err.error.error.message) }
      )
    } else {
      subs = this._serviceClientTicket.postClient(client).subscribe(
        rs => {
          this._serviceClientTicket.loadData()
          form.resetForm()
        },
        err => { Helpers.setLoading(false); alert(err.error.error.message) }
      )
    }
    this.subsArr.push(subs)

  }

  ngAfterViewInit() {
    this._script.loadScripts('app-client-ticket',
      [
        'assets/vendors/custom/datatables/datatables.bundle.js',
        'assets/demo/default/custom/crud/datatables/basic/paginations.js',
        'assets/demo/default/custom/crud/forms/widgets/select2.js',
        'assets/demo/default/custom/crud/forms/validation/form-controls.js',
        'assets/demo/default/custom/crud/forms/widgets/bootstrap-datetimepicker.js'
      ]);
    this.dtTrigger.next();
  }

  loadScript() {
    const dataAirport = this.listAirports.map(item => {
      return { id: item.airportCode, text: item.airportName }
    })
    const dataClient = this.listClients.map(item => {
      return { id: item.id, text: item.fullName }
    })
    $("#m_select2_4_1").select2({ data: dataClient })
    $("#m_select2_4_2").select2({ data: dataAirport })
    $("#m_select2_4_3").select2({ data: dataAirport })
    $("#m_select2_4_4").select2({ data: dataAirport })
    $("#m_select2_4_5").select2({ data: dataAirport })
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


}
