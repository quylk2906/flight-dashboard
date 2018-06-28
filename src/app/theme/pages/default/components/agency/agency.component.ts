import { Component, OnInit, AfterViewInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { trimObjectAfterSave } from '../../../../../_utils/trimObject';
import { find } from 'lodash';
import { ObjectUnsubscribedError, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Helpers } from '../../../../../helpers';
import { Agency } from '../../../../../_models/agency.model';
import { AgencyService } from '../../../../../_services/agency.service';
import { DataTableDirective } from 'angular-datatables';
import { ViewChild } from '@angular/core';


@Component({
  selector: 'app-agency',
  templateUrl: './agency.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: []
})
export class AgencyComponent implements OnInit, OnDestroy, AfterViewInit {
  private subs: Subscription
  public list: Agency[]
  private subsArr: Subscription[] = []
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

  public currentItem: Agency = {
    agencyName: undefined,
    agencyCode: undefined,
    representative: undefined,
    identification: undefined,
    phoneNumber: undefined,
    address: undefined,
    id: undefined,
    createdAt: undefined,
    updatedAt: undefined
  }

  constructor(private _script: ScriptLoaderService,
    private _toastr: ToastrService,
    private _service: AgencyService

  ) {
  }


  ngOnInit() {
    Helpers.setLoading(true)
    this.list = this._service.getAgencies();
    const sub = this._service.listAgencyhanged.subscribe(
      rs => {
        console.log(rs);
        this.list = rs
        this.rerender()
      },
      err => {
        this._toastr.error(err, undefined, { closeButton: true });
      })
    this.subsArr.push(sub)
    this._service.loadData()
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return
    }
    Helpers.setLoading(true)
    const agency = trimObjectAfterSave(form.value)
    let sub: Subscription
    if (this.currentItem.id) {
      sub = this._service.putAgencies(agency).subscribe(
        rs => {
          this._service.loadData()
          form.resetForm()
          this._toastr.info('Thay đổi thành công', undefined, { closeButton: true });
        },
        err => {
          this._toastr.error(err.error.error.message, undefined, { closeButton: true });
          Helpers.setLoading(false)
        }
      )
    } else {
      sub = this._service.postAgencies(agency).subscribe(
        rs => {
          this._service.loadData()
          form.resetForm()
          this._toastr.info('Thêm thành công', undefined, { closeButton: true });
        },
        err => {
          this._toastr.error(err.error.error.message, undefined, { closeButton: true });
          Helpers.setLoading(false)
        }
      )
    }
    this.subsArr.push(sub)
  }

  onDelete(id) {
    const sub = this._service.deleteAgency(id).subscribe(rs => {
      if (rs['count'] !== 0) {
        this._toastr.info('Xóa thành công', undefined, { closeButton: true });
        this._service.loadData()
      }
    })
    this.subsArr.push(sub)
  }

  onEdit(id) {
    this.currentItem = find(this.list, (item) => {
      return item.id == id
    })
  }

  ngOnDestroy() {
    this.subsArr.forEach(sub => sub.unsubscribe())
    Helpers.setLoading(true)
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit() {
    this._script.loadScripts('app-agency',
      [
        'assets/vendors/custom/datatables/datatables.bundle.js',
        'assets/demo/default/custom/crud/datatables/standard/paginations.js',
        'assets/demo/default/custom/crud/forms/validation/form-controls.js'
      ]);
    this.dtTrigger.next();
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
}
