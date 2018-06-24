import { Component, OnInit, AfterViewInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { trimObjectAfterSave } from '../../../../../_utils/trimObject';
import { find } from 'lodash';
import { Helpers } from '../../../../../helpers';
import { ClientService } from '../../../../../_services/client.service';
import { Client } from '../../../../../_models/client.model';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ClientComponent implements OnInit, OnDestroy {
  private subs: Subscription
  public currentItem: Client = {
    fullName: undefined,
    phoneNumber: undefined,
    address: undefined,
    id: undefined,
    createdAt: undefined,
    updatedAt: undefined
  }

  constructor(private _script: ScriptLoaderService,
    private _service: ClientService) {
  }

  ngOnInit() {
    const flightApi = this._service.getClients()

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
    this.currentItem.fullName = selectFlight
    this.currentItem.phoneNumber = selectPlane
    this.currentItem.address = returnDate

    if (this.currentItem.id) {
      this.subs = this._service.putClient(this.currentItem).subscribe(
        rs => { window.location.reload() },
        err => { alert(err.error.error.message) }
      )
    } else {
      this.subs = this._service.postClient(this.currentItem).subscribe(
        rs => { window.location.reload() },
        err => { alert(err.error.error.message) }
      )
    }
  }

  onDelete(id) {
    this.subs = this._service.deleteClient(id).subscribe(rs => {
      if (rs['count'] !== 0) {
        // you have to call api to reload datable without reload page
        window.location.reload()
      }
    })
  }

  onEdit(id) {
    // this.currentItem = find(this.list, (item) => { return item.id == id })
    // $("#m_select2_4_2").val(this.currentItem.planeId).trigger('change')
    // $("#m_select2_4_1").val(this.currentItem.flightId).trigger('change')
  }

  ngOnDestroy(): void {
    Helpers.setLoading(true)
    // this.subs.unsubscribe()
  }


  loadScript() {
    // const dataPlane = this.listPlane.map(item => { return { id: item.id, text: item.planeName } })
    // const dataFlight = this.listFlight.map(item => { return { id: item.id, text: item.flightCode } })
    // $("#m_select2_4_2").select2({ data: dataPlane })
    // $("#m_select2_4_1").select2({ data: dataFlight })

    this._script.loadScripts('app-client',
      [
        'assets/vendors/custom/datatables/datatables.bundle.js',
        'assets/demo/default/custom/crud/datatables/standard/paginations.js',
        'assets/demo/default/custom/crud/forms/validation/form-controls.js'
      ]);
  }
}
