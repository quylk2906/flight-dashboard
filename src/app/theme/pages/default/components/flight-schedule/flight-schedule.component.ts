import { Component, OnInit, AfterViewInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NgForm } from '@angular/forms';
import { FlightScheduleService } from '../../../../../_services/flight-schedule.service';
import { Subscription } from 'rxjs/Subscription';
import { FlightSchedule } from '../../../../../_models/flight-schedule.model';
import { trimObjectAfterSave } from '../../../../../_utils/trimObject';
import { find } from 'lodash';

@Component({
  selector: 'app-flight-schedule',
  templateUrl: './flight-schedule.component.html',
  encapsulation: ViewEncapsulation.None
})
export class FlightScheduleComponent implements OnInit, OnDestroy, AfterViewInit {
  private subs: Subscription
  public list: FlightSchedule[]
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

  constructor(private _script: ScriptLoaderService, private _service: FlightScheduleService) {
  }


  ngOnInit() {
    this.subs = this._service.getFlightSchedule().subscribe(rs => {
      this.list = rs as FlightSchedule[]
      console.log(this.list);
    })
  }

  onSubmit(from: NgForm) {
    const agent = trimObjectAfterSave(from.value)
    if (this.currentItem.id) {
      this.subs = this._service.putFlightSchedule(agent).subscribe(rs => {
        // you have to call api to reload datable without reload page
        window.location.reload()
      })
    } else {
      this.subs = this._service.postFlightSchedule(agent).subscribe(rs => {
        this.list.push(rs as FlightSchedule)
        // you have to call api to reload datable without reload page
        window.location.reload()
      })
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
