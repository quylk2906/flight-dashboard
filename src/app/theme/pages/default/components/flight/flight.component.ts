import { Component, OnInit, AfterViewInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NgForm } from '@angular/forms';
import { FlightService } from '../../../../../_services/flight.service';
import { AirlineAgentService } from '../../../../../_services/airline-agent.service';
import { Subscription } from 'rxjs/Subscription';
import { Flight } from '../../../../../_models/flight.model';
import { trimObjectAfterSave } from '../../../../../_utils/trimObject';
import { find, some } from 'lodash';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { AirlineAgent } from '../../../../../_models/airline-agent.model';
import { Airport } from '../../../../../_models/airport.model';
import { AirportService } from '../../../../../_services/airport.service';
// import { Select2 } from 'select2';

@Component({
  selector: "app-flight",
  templateUrl: "./flight.component.html",
  encapsulation: ViewEncapsulation.None,
})

export class FlightComponent implements OnInit, OnDestroy, AfterViewInit {
  private subs: Subscription
  public list: Flight[]
  public listAirlineAgent: AirlineAgent[]
  public listAirport: Airport[]

  public currentItem: Flight = {
    flightCode: undefined,
    arrivalAirport: undefined,
    departureAirport: undefined,
    arrivalTime: undefined,
    departureTime: undefined,
    airlineAgentId: undefined,
    id: undefined,
    createdAt: undefined,
    updatedAt: undefined
  }

  constructor(private _script: ScriptLoaderService,
    private _service: FlightService,
    private _agentService: AirlineAgentService,
    private _airportService: AirportService
  ) {
  }

  ngOnInit() {
    const aorlineAgentApi = this._agentService.getAirlineAgent()
    const flightApi = this._service.getFlight()
    const airportApi = this._airportService.getAirport()

    this.subs = forkJoin([aorlineAgentApi, flightApi, airportApi]).subscribe(rs => {
      this.list = rs[1] as Flight[]
      this.listAirlineAgent = rs[0] as AirlineAgent[]
      this.listAirport = rs[2] as Airport[]
      this.loadScript()
      console.log(rs);
    })
  }

  loadScript() {
    const dataAirlineAgent = this.listAirlineAgent.map(item => { return { id: item.id, text: item.airlineAgentName } })
    const dataAirport = this.listAirport.map(item => { return { id: item.id, text: item.airportName } })
    $("#m_select2_4_1").select2({ data: dataAirport })
    $("#m_select2_4_2").select2({ data: dataAirport })
    $("#m_select2_4_3").select2({ data: dataAirlineAgent })
    this._script.loadScripts('app-flight',
      [
        'assets/vendors/custom/datatables/datatables.bundle.js',
        'assets/demo/default/custom/crud/forms/widgets/select2.js',
        'assets/demo/default/custom/crud/datatables/standard/paginations.js', ,
        'assets/demo/default/custom/crud/forms/validation/form-controls.js',
        'assets/demo/default/custom/crud/forms/widgets/bootstrap-datetimepicker.js'
      ]);
  }

  onSubmit(form: NgForm) {
    const flight = form.value as Flight
    flight.departureTime = $('#m_datetimepicker_1_1').val().toString()
    flight.arrivalTime = $('#m_datetimepicker_1').val().toString()
    flight.airlineAgentId = $("#m_select2_4_3").val().toString()
    flight.departureAirport = $("#m_select2_4_1").val().toString()
    flight.arrivalAirport = $("#m_select2_4_2").val().toString()
    console.log(flight);
    if (this.currentItem.id) {
      this.subs = this._service.putFlight(flight).subscribe(
        rs => { window.location.reload() },
        err => { alert(err.error.error.message) }
      )
    } else {

      this.subs = this._service.postFlight(flight).subscribe(
        rs => { window.location.reload() },
        err => { alert(err.error.error.message) }
      )
    }
  }

  onDelete(id) {
    console.log(id);
    this.subs = this._service.deleteFlight(id).subscribe(rs => {
      if (rs['count'] !== 0) {
        // you have to call api to reload datable without reload page

        console.log('window.location.reload()');
        // window.location.reload()
      }
    })
  }

  onEdit(id) {
    this.currentItem = find(this.list, (item) => {
      return item.id == id
    })
    $("#m_select2_4_1").text(this.currentItem.departureAirport).trigger('change')
    $("#m_select2_4_2").val(this.currentItem.arrivalAirport).trigger('change')
    $("#m_select2_4_3").val(this.currentItem.airlineAgentId).trigger('change')
  }

  loadData() {
    console.log('loadData');
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  ngAfterViewInit() {

  }
}
