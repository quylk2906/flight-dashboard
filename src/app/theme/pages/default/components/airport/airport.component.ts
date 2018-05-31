import { Component, OnInit, AfterViewInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NgForm } from '@angular/forms';
import { AirportService } from '../../../../../_services/airport.service';
import { Subscription } from 'rxjs/Subscription';
import { Airport } from '../../../../../_models/airport.model';
import { trimObjectAfterSave } from '../../../../../_utils/trimObject';
import { find } from 'lodash';

@Component({
  selector: 'app-airport',
  templateUrl: './airport.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AirportComponent implements OnInit, OnDestroy, AfterViewInit {
  private subs: Subscription
  public list: Airport[]
  public currentItem: Airport = {
    airportCode: undefined,
    airportName: undefined,
    region: undefined,
    description: undefined,
    id: undefined,
    createdAt: undefined,
    updatedAt: undefined
  }

  constructor(private _script: ScriptLoaderService, private _service: AirportService) {
  }


  ngOnInit() {
    this.subs = this._service.getAirport().subscribe(rs => {
      this.list = rs as Airport[]
      console.log(this.list);
    })
  }

  onSubmit(from: NgForm) {
    const agent = trimObjectAfterSave(from.value)
    if (this.currentItem.id) {
      this.subs = this._service.putAirport(agent).subscribe(rs => {
        // you have to call api to reload datable without reload page
        window.location.reload()
      })
    } else {
      this.subs = this._service.postAirport(agent).subscribe(rs => {
        this.list.push(rs as Airport)
        // you have to call api to reload datable without reload page
        window.location.reload()
      })
    }
  }

  onDelete(id) {
    this.subs = this._service.deleteAirport(id).subscribe(rs => {
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
    this._script.loadScripts('app-airport',
      [
        'assets/vendors/custom/datatables/datatables.bundle.js',
        'assets/demo/default/custom/crud/datatables/standard/paginations.js',
        'assets/demo/default/custom/crud/forms/validation/form-controls.js'
      ]);
  }
}
