import { Component, OnInit, AfterViewInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NgForm } from '@angular/forms';
import { FlightScheduleService } from '../../../../../_services/flight-schedule.service';
import { FlightService } from '../../../../../_services/flight.service';
import { PlaneService } from '../../../../../_services/plane.service';
import { Subscription } from 'rxjs/Subscription';
import { FlightSchedule } from '../../../../../_models/flight-schedule.model';
import { Flight } from '../../../../../_models/flight.model';
import { Plane } from '../../../../../_models/plane.model';
import { trimObjectAfterSave } from '../../../../../_utils/trimObject';
import { find } from 'lodash';
import { forkJoin } from 'rxjs/observable/forkJoin';
// import moduleName from './assets/vendors/base/vendors.bundle.js';

@Component({
  selector: 'app-flight-schedule',
  templateUrl: './flight-schedule.component.html',
  encapsulation: ViewEncapsulation.None
})
export class FlightScheduleComponent implements OnInit, OnDestroy, AfterViewInit {
  private subs: Subscription
  public list: FlightSchedule[]
  public listFlight: Flight[]
  public listPlane: Plane[]
  public currentItem: FlightSchedule = {
    flightScheduleCode: undefined,
    flightId: undefined,
    planeId: undefined,
    departureDate: undefined,
    returnDate: undefined,
    id: undefined,
    createdAt: undefined,
    updatedAt: undefined
  }

  constructor(private _script: ScriptLoaderService,
    private _service: FlightScheduleService,
    private _serviceFlight: FlightService,
    private _servicePlane: PlaneService) {
  }


  ngOnInit() {
    const flightApi = this._serviceFlight.getFlight()
    const planeApi = this._servicePlane.getPlane()
    const flightScheduleApi = this._service.getFlightSchedule()
    this.subs = forkJoin([flightScheduleApi, flightApi, planeApi,]).subscribe(rs => {
      this.list = rs[0] as [FlightSchedule]
      this.listFlight = rs[1] as [Flight]
      this.listPlane = rs[2] as [Plane]
      console.log(rs);
    })
  }

  onSubmit(form: NgForm) {
    const selectFlight = $("#m_select2_4").val().toString()
    const selectPlane = $("#m_select2_4_1").val().toString()
    const departDate = $('#m_datetimepicker_1').val().toString()
    const returnDate = $('#m_datetimepicker_1_1').val().toString()
    this.currentItem = form.value
    this.currentItem.flightId = selectFlight.slice(2, selectFlight.length).trim()
    this.currentItem.planeId = selectPlane.slice(2, selectPlane.length).trim()
    this.currentItem.returnDate = returnDate
    this.currentItem.departureDate = departDate

    if (this.currentItem.id) {
      this.subs = this._service.putFlightSchedule(this.currentItem).subscribe(rs => {
        window.location.reload()
      })
    } else {
      this.subs = this._service.postFlightSchedule(this.currentItem).subscribe(rs => {
        window.location.reload()
      })
    }
    // console.log(form.value);
  }

  test(event) {
    console.log(event);
  }
  onDelete(id) {
    this.subs = this._service.deleteFlightSchedule(id).subscribe(rs => {
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
    this._script.loadScripts('app-flight-schedule',
      [
        'assets/vendors/custom/datatables/datatables.bundle.js',
        'assets/demo/default/custom/crud/forms/widgets/select2.js',
        'assets/demo/default/custom/crud/datatables/standard/paginations.js',
        'assets/demo/default/custom/crud/forms/validation/form-controls.js',
        'assets/demo/default/custom/crud/forms/widgets/bootstrap-datetimepicker.js'
      ]);
  }
}
