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
import { Select2, DataFormat } from 'select2';
import { Helpers } from '../../../../../helpers';

@Component({
  selector: 'app-client-schedule',
  templateUrl: './client.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ClientComponent implements OnInit, OnDestroy, AfterViewInit {
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
    const flightApi = this._serviceFlight.getFlights()
    const planeApi = this._servicePlane.getPlane()
    const flightScheduleApi = this._service.getFlightSchedulesIncluded()
    // this.subs = forkJoin([flightScheduleApi, flightApi, planeApi,]).subscribe(rs => {
    //   this.list = rs[0] as [FlightSchedule]
    //   this.listFlight = rs[1] as [Flight]
    //   this.listPlane = rs[2] as [Plane]
    //   this.loadScript()
    //   console.log(rs);
    // })
  }

  onSubmit(form: NgForm) {
    // if (form.invalid) {
    //   return
    // }
    const selectFlight = $("#m_select2_4_1").val().toString()
    const selectPlane = $("#m_select2_4_2").val().toString()
    const departDate = $('#m_datetimepicker_1').val().toString()
    const returnDate = $('#m_datetimepicker_1_1').val().toString()
    this.currentItem = form.value
    this.currentItem.flightId = selectFlight
    this.currentItem.planeId = selectPlane
    this.currentItem.returnDate = returnDate
    this.currentItem.departureDate = departDate

    if (this.currentItem.id) {
      this.subs = this._service.putFlightSchedule(this.currentItem).subscribe(
        rs => { window.location.reload() },
        err => { alert(err.error.error.message) }
      )
    } else {
      this.subs = this._service.postFlightSchedule(this.currentItem).subscribe(
        rs => { window.location.reload() },
        err => { alert(err.error.error.message) }
      )
    }
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
    this.currentItem = find(this.list, (item) => { return item.id == id })
    $("#m_select2_4_2").val(this.currentItem.planeId).trigger('change')
    $("#m_select2_4_1").val(this.currentItem.flightId).trigger('change')
  }

  ngOnDestroy(): void {
    Helpers.setLoading(true)
    // this.subs.unsubscribe()
  }

  ngAfterViewInit() {

  }

  loadScript() {
    const dataPlane = this.listPlane.map(item => { return { id: item.id, text: item.planeName } })
    const dataFlight = this.listFlight.map(item => { return { id: item.id, text: item.flightCode } })
    $("#m_select2_4_2").select2({ data: dataPlane })
    $("#m_select2_4_1").select2({ data: dataFlight })

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
