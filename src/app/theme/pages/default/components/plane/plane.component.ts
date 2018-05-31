import { Component, OnInit, AfterViewInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NgForm } from '@angular/forms';
import { PlaneService } from '../../../../../_services/plane.service';
import { Subscription } from 'rxjs/Subscription';
import { Plane } from '../../../../../_models/plane.model';
import { trimObjectAfterSave } from '../../../../../_utils/trimObject';
import { find } from 'lodash';
import { ObjectUnsubscribedError } from 'rxjs';


@Component({
  selector: 'app-plane',
  templateUrl: './plane.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: []
})
export class PlaneComponent implements OnInit, OnDestroy, AfterViewInit {
  private subs: Subscription
  public list: Plane[]
  public currentItem: Plane = {
    planeCode: undefined,
    planeName: undefined,
    seatNumber: undefined,
    availableSeatNumber: undefined,
    id: undefined,
    createdAt: undefined,
    updatedAt: undefined
  }

  constructor(private _script: ScriptLoaderService, private _service: PlaneService) {
  }


  ngOnInit() {
    this.subs = this._service.getPlane().subscribe(rs => {
      this.list = rs as Plane[]
      console.log(this.list);
    })
  }

  onSubmit(form: NgForm) {

    if (form.invalid) {
      return
    }
    const agent = trimObjectAfterSave(form.value)
    
    if (this.currentItem.id) {
      this.subs = this._service.putPlane(agent).subscribe(rs => {
        // you have to call api to reload datable without reload page
        window.location.reload()
      })
    } else {
      this.subs = this._service.postPlane(agent).subscribe(rs => {
        this.list.push(rs as Plane)
        // you have to call api to reload datable without reload page
        window.location.reload()
      })
    }
  }

  onDelete(id) {
    this.subs = this._service.deletePlane(id).subscribe(rs => {
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
    this._script.loadScripts('app-plane',
      [
        'assets/vendors/custom/datatables/datatables.bundle.js',
        'assets/demo/default/custom/crud/datatables/standard/paginations.js',
        'assets/demo/default/custom/crud/forms/validation/form-controls.js'
      ]);
  }
}
