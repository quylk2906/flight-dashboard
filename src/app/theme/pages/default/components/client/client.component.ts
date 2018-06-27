
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { trimObjectAfterSave } from '../../../../../_utils/trimObject';
import { find } from 'lodash';
import { Helpers } from '../../../../../helpers';
import { ClientService } from '../../../../../_services/client.service';
import { Client } from '../../../../../_models/client.model';

import { Component, OnInit, AfterViewInit, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ClientComponent implements OnInit, OnDestroy, AfterViewInit {
  public list: Client[]
  private subsArr: Subscription[] = []
  public currentItem: Client = {
    fullName: undefined,
    phoneNumber: undefined,
    address: undefined,
    id: undefined,
    createdAt: undefined,
    updatedAt: undefined
  }

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {
    responsive: true,
    pagingType: "full_numbers",
    columnDefs: [
    ],
    order: [[0, "desc"]]
  };
  dtTrigger = new Subject();


  constructor(private _script: ScriptLoaderService,
    private _service: ClientService) {
  }

  ngOnInit() {
    Helpers.setLoading(true)
    this.list = this._service.getClients();
    const sub1 = this._service.listClientsChanged.subscribe(
      rs => {
        console.log(rs);
        this.list = rs
        this.rerender()
      },
      err => {
        console.log('console.log(err);');
        console.log(err);
      })
    this._service.loadData()
    this.subsArr.push(sub1)
  }

  onSubmit(form: NgForm) {
    Helpers.setLoading(true)
    if (form.invalid) {
      return
    }
    let sub: Subscription
    if (this.currentItem.id) {
      sub = this._service.putClient(this.currentItem).subscribe(
        rs => {
          this._service.loadData()
          form.resetForm()
        },
        err => {
          alert(err.error.error.message)
          Helpers.setLoading(false)
        }
      )
    } else {
      sub = this._service.postClient(this.currentItem).subscribe(
        rs => {
          this._service.loadData()
          form.resetForm()
        },
        err => {
          alert(err.error.error.message)
          Helpers.setLoading(false)
        }
      )
    }
    this.subsArr.push(sub)
  }

  onDelete(id) {
    Helpers.setLoading(true)
    const sub1 = this._service.deleteClient(id).subscribe(rs => {
      if (rs['count'] !== 0) {
        // you have to call api to reload datable without reload page
        this._service.loadData()
      }
    })
    this.subsArr.push(sub1)
  }

  onEdit(id) {
    this.currentItem = find(this.list, (item) => { return item.id == id })
  }

  ngOnDestroy() {
    this.subsArr.forEach(sub => sub.unsubscribe())
    this.dtTrigger.unsubscribe();
  }

  rerender() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
      Helpers.setLoading(false)
    });
  }



  ngAfterViewInit() {
    this._script.loadScripts('app-client',
      [
        'assets/vendors/custom/datatables/datatables.bundle.js',
        'assets/demo/default/custom/crud/datatables/standard/paginations.js',
        'assets/demo/default/custom/crud/forms/validation/form-controls.js'
      ]);
    this.dtTrigger.next();
  }
}
