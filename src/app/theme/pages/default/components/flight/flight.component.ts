import { Component, OnInit, AfterViewInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NgForm } from '@angular/forms';
import { FlightService } from '../../../../../_services/flight.service';
import { AirportService } from '../../../../../_services/airport.service';
import { Subscription } from 'rxjs/Subscription';
import { Flight } from '../../../../../_models/flight.model';
import { trimObjectAfterSave } from '../../../../../_utils/trimObject';
import { find, some } from 'lodash';
import { Airport } from '../../../../../_models/airport.model';
import { forkJoin } from 'rxjs/observable/forkJoin';
// import { Select2 } from 'select2';

@Component({
  selector: "app-flight",
  templateUrl: "./flight.component.html",
  encapsulation: ViewEncapsulation.None,
})

export class FlightComponent implements OnInit, OnDestroy, AfterViewInit {
  private subs: Subscription
  public list: Flight[]
  public listAirport: Airport[]
  public currentItem: Flight = {
    flightCode: undefined,
    arrivalAirport: undefined,
    departureAirport: undefined,
    arrivalTime: undefined,
    departureTime: undefined,
    airportId: undefined,
    id: undefined,
    createdAt: undefined,
    updatedAt: undefined
  }

  constructor(private _script: ScriptLoaderService, private _service: FlightService, private _airportService: AirportService) {
  }


  ngOnInit() {
    const airportApi = this._airportService.getAirport()
    const flightApi = this._service.getFlight()
    this.subs = forkJoin([airportApi, flightApi]).subscribe(rs => {
      this.list = rs[1] as Flight[]
      this.listAirport = rs[0] as Airport[]
      this.loadScript()
      console.log(rs);
    })
  }

  loadScript() {
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
    console.log(this.currentItem);
    const flight = form.value as Flight
    if (this.currentItem.id) {
      this.subs = this._service.putFlight(flight).subscribe(rs => {
        window.location.reload()
      })
    } else {
      const selectValue = $("#m_select2_4").val().toString()
      flight.departureTime = $('#m_datetimepicker_1_1').val().toString()
      flight.arrivalTime = $('#m_datetimepicker_1').val().toString()
      flight.airportId = selectValue.slice(2, selectValue.length).trim()
      this.subs = this._service.postFlight(flight).subscribe(rs => {
        // you have to call api to reload datable without reload page
        window.location.reload()
      })
    }
  }

  onDelete(id) {
    this.subs = this._service.deleteFlight(id).subscribe(rs => {
      if (rs['count'] !== 0) {
        // you have to call api to reload datable without reload page
        window.location.reload()
      }
    })
  }

  onEdit(id) {
    this.currentItem = find(this.list, (item) => {
      return item.id == id
    })
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
