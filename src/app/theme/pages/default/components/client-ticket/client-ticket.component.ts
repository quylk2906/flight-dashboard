import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { Airport } from '../../../../../_models/airport.model';
import { Client } from '../../../../../_models/client.model';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Subscription } from 'rxjs/Subscription';
import { ClientService } from '../../../../../_services/client.service';
import { AirportService } from '../../../../../_services/airport.service';
import { Select2 } from 'select2';
import { ClientTicket } from '../../../../../_models/client-ticket.model';

@Component({
  selector: 'app-client-ticket',
  templateUrl: './client-ticket.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: []
})
export class ClientTicketComponent implements OnInit, OnDestroy {
  private subs: Subscription
  listAirports: Airport[]
  listClients: Client[]
  
  public currentItem: ClientTicket = {
    maDatCho: undefined,
    maXuatVe: undefined,
    tinhTrangVe: undefined,
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

  constructor(private _script: ScriptLoaderService,
    private _serviceClient: ClientService,
    private _serviceAirport: AirportService) { }

  ngOnInit() {
    const clientApi = this._serviceClient.getClients()
    const airportApi = this._serviceAirport.getAirports()

    this._serviceAirport.loadData()
    this._serviceClient.loadData()
  }


  loadScript() {
    const dataAirport = this.listAirports.map(item => { return { id: item.airportCode, text: item.airportName } })
    const dataClient = this.listClients.map(item => { return { id: item.id, text: item.fullName } })

    $("#m_select2_4_1").select2({ data: dataClient })
    $("#m_select2_4_2").select2({ data: dataAirport })
    $("#m_select2_4_3").select2({ data: dataAirport })
    $("#m_select2_4_4").select2({ data: dataAirport })
    $("#m_select2_4_5").select2({ data: dataAirport })

    this._script.loadScripts('app-client-ticket',
      [
        'assets/vendors/custom/datatables/datatables.bundle.js',
        'assets/demo/default/custom/crud/datatables/basic/paginations.js',
        'assets/demo/default/custom/crud/forms/validation/form-controls.js',
        'assets/demo/default/custom/crud/forms/widgets/bootstrap-datetimepicker.js'
      ]);
  }

  ngOnDestroy() {

  }
}
