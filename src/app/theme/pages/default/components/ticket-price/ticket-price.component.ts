import { Component, OnInit, AfterViewInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NgForm } from '@angular/forms';
import { TicketPriceService } from '../../../../../_services/ticket-price.service';
import { FlightScheduleService } from '../../../../../_services/flight-schedule.service';
import { AirlineAgentService } from '../../../../../_services/airline-agent.service';
import { Subscription } from 'rxjs/Subscription';
import { TicketPrice } from '../../../../../_models/ticket-price.model';
import { FlightSchedule } from '../../../../../_models/flight-schedule.model';
import { AirlineAgent } from '../../../../../_models/airline-agent.model';
import { trimObjectAfterSave } from '../../../../../_utils/trimObject';
import { find } from 'lodash';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Component({
  selector: 'app-ticket-price',
  templateUrl: './ticket-price.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TicketPriceComponent implements OnInit, OnDestroy, AfterViewInit {
  private subs: Subscription
  public list: TicketPrice[]
  public listFlightSchedule: FlightSchedule[]
  public listAirline: AirlineAgent[]

  public currentItem: TicketPrice = {
    ticketPriceCode: undefined,
    airlineAgentId: undefined,
    ticketClassId: undefined,
    flightScheduleId: undefined,
    adultPrice: undefined,
    kidPrice: undefined,
    adultTax: undefined,
    kidTax: undefined,
    id: undefined,
    createdAt: undefined,
    updatedAt: undefined
  }

  constructor(private _script: ScriptLoaderService,
    private _service: TicketPriceService,
    private _serviceSchedule: FlightScheduleService,
    private _serviceAirline: AirlineAgentService
  ) {
  }


  ngOnInit() {
    const flightScheduleApi = this._serviceSchedule.getFlightSchedule()
    const airlineApi = this._serviceAirline.getAirlineAgent()
    const ticketPriceApi = this._service.getTicketPrice()
    this.subs = forkJoin([ticketPriceApi, flightScheduleApi, airlineApi]).subscribe(rs => {
      this.list = rs[0] as TicketPrice[]
      this.listFlightSchedule = rs[1] as FlightSchedule[]
      this.listAirline = rs[2] as AirlineAgent[]
      console.log(rs);
    })
  }

  changeShape() {
    console.log('it works');
  }
  onSubmit(form: NgForm) {
    const selectAirline = $("#m_select2_4").val().toString()
    const selectFlightSchedule = $("#m_select2_4_1").val().toString()
    this.currentItem = form.value
    this.currentItem.flightScheduleId = selectFlightSchedule.slice(3, selectFlightSchedule.length).trim()
    this.currentItem.airlineAgentId = selectAirline.slice(3, selectAirline.length).trim()

    if (this.currentItem.id) {
      this.subs = this._service.putTicketPrice(this.currentItem).subscribe(rs => {
        window.location.reload()
      })
    } else {
      this.subs = this._service.postTicketPrice(this.currentItem).subscribe(rs => {
        this.list.push(rs as TicketPrice)
        window.location.reload()
      })
    }
    console.log(this.currentItem);
  }

  onDelete(id) {
    this.subs = this._service.deleteTicketPrice(id).subscribe(rs => {
      if (rs['count'] !== 0) {
        window.location.reload()
      }
    })
  }

  onEdit(id) {
    this.currentItem = find(this.list, (item) => {
      return item.id == id
    })
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  ngAfterViewInit() {
    this._script.loadScripts('app-ticket-price',
      [
        'assets/vendors/custom/datatables/datatables.bundle.js',
        'assets/demo/default/custom/crud/forms/widgets/select2.js',
        'assets/demo/default/custom/crud/datatables/standard/paginations.js',
        'assets/demo/default/custom/crud/forms/validation/form-controls.js',
        'assets/demo/default/custom/crud/forms/widgets/bootstrap-datetimepicker.js'
      ]);
  }
}
