import { Component, OnInit, AfterViewInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NgForm } from '@angular/forms';
import { FlightService } from '../../../../../_services/flight.service';
import { AirportService } from '../../../../../_services/airport.service';
import { Subscription } from 'rxjs/Subscription';
import { Flight } from '../../../../../_models/flight.model';
import { trimObjectAfterSave } from '../../../../../_utils/trimObject';
import { find } from 'lodash';
import { Airport } from '../../../../../_models/airport.model';
import { forkJoin } from 'rxjs/observable/forkJoin';

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
      console.log(rs);
    })
  }

  onSubmit(from: NgForm) {
    // const flight = trimObjectAfterSave(from.value)
    console.log(from.value);
    // if (this.currentItem.id) {
    //   this.subs = this._service.putFlight(agent).subscribe(rs => {
    //     // you have to call api to reload datable without reload page
    //     window.location.reload()
    //   })
    // } else {
    //   this.subs = this._service.postFlight(agent).subscribe(rs => {
    //     this.list.push(rs as Flight)
    //     // you have to call api to reload datable without reload page
    //     window.location.reload()
    //   })
    // }
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

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  ngAfterViewInit() {
    this._script.loadScripts('app-flight',
      [
        'assets/vendors/custom/datatables/datatables.bundle.js',
        'assets/demo/default/custom/crud/forms/widgets/select2.js',
        'assets/demo/default/custom/crud/datatables/standard/paginations.js', ,
        'assets/demo/default/custom/crud/forms/validation/form-controls.js',
        'assets/demo/default/custom/crud/forms/widgets/bootstrap-datetimepicker.js'
      ]);
  }
}
