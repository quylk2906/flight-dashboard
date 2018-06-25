import { Component, OnInit, AfterViewInit, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NgForm } from '@angular/forms';
import { AirportService } from '../../../../../_services/airport.service';
import { Subscription } from 'rxjs/Subscription';
import { Airport } from '../../../../../_models/airport.model';
import { trimObjectAfterSave } from '../../../../../_utils/trimObject';
import { find } from 'lodash';
import { Helpers } from '../../../../../helpers';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-airport',
  templateUrl: './airport.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AirportComponent implements OnInit, OnDestroy, AfterViewInit {
  private subs: Subscription
  public list: Airport[]
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {
    responsive: !0,
    pagingType: "full_numbers",
    columnDefs: [
    ],
    order: [[0, "desc"]]
  };
  dtTrigger = new Subject();

  public currentItem: Airport = {
    airportCode: undefined,
    airportName: undefined,
    id: undefined,
    createdAt: undefined,
    updatedAt: undefined
  }

  constructor(private _script: ScriptLoaderService,
    private _service: AirportService
  ) {
  }

  ngOnInit() {
    Helpers.setLoading(true)

    this.list = this._service.getAirports();
    this.subs = this._service.listAirportsChanged.subscribe(
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
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return
    }
    Helpers.setLoading(true)
    const agent = trimObjectAfterSave(form.value)
    if (this.currentItem.id) {
      this.subs = this._service.putAirport(agent).subscribe(
        rs => {
          Helpers.setLoading(false)
        },
        err => {
          alert(err.error.error.message);
          Helpers.setLoading(false)
        }
      )
    } else {
      this.subs = this._service.postAirport(agent).subscribe(
        rs => {
          Helpers.setLoading(false)
          this.handleDataTable()
        },
        err => {
          alert(err.error.error.message)
          Helpers.setLoading(false)
        }
      )
    }
  }


  handleDataTable() {
    this._service.loadData()
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
    Helpers.setLoading(true)
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit() {
    this._script.loadScripts('app-airport',
      [
        'assets/vendors/custom/datatables/datatables.bundle.js',
        'assets/demo/default/custom/crud/datatables/standard/paginations.js',
        'assets/demo/default/custom/crud/forms/validation/form-controls.js'
      ]);
    this.dtTrigger.next();
  }

  rerender() {
    console.log('rerender');
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
      Helpers.setLoading(false)
    });
  }
}
