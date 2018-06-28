import { Component, OnInit, AfterViewInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { trimObjectAfterSave } from '../../../../../_utils/trimObject';
import { find } from 'lodash';
import { ObjectUnsubscribedError, Subject } from 'rxjs';
import { AgencyService } from '../../../../../_services/agency.service';
import { DepositService } from '../../../../../_services/deposit.service';
import { ToastrService } from 'ngx-toastr';
import { Deposit } from '../../../../../_models/deposit.model';
import { Agency } from '../../../../../_models/agency.model';
import { DataTableDirective } from 'angular-datatables';
import { ViewChild } from '@angular/core';
import { Helpers } from '../../../../../helpers';


@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: []
})
export class DepositComponent implements OnInit, OnDestroy, AfterViewInit {
  private subsArr: Subscription[]
  list: Deposit[]
  listAgencies: Agency[]
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

  public currentItem: Deposit = {
    agencyId: undefined,
    totalDeposit: undefined,
    currentBalance: undefined,
    id: undefined,
    createdAt: undefined,
    updatedAt: undefined
  }

  constructor(private _script: ScriptLoaderService,
    private _serviceDeposit: DepositService,
    private _serviceAgency: AgencyService,
    private _toastr: ToastrService
  ) {
  }


  ngOnInit() {
    this.subsArr = []
    Helpers.setLoading(true)

    this.list = this._serviceDeposit.getDeposits()
    this._serviceDeposit.loadData()

    const sub1 = this._serviceDeposit.listAirportsChanged.subscribe(
      rs => {
        this.list = rs
        this.rerender()
      },
      err => {
        console.log(err);
      })

    const sub2 = this._serviceAgency.getAgenciesObservable().subscribe(
      res => {
        console.log('object', res);
        this.listAgencies = res as Agency[]
        this.loadScript()
      },
      err => {
        console.log(err);
      })

    this.subsArr.push(sub1)
    this.subsArr.push(sub2)
  }

  onSubmit(form: NgForm) {
    if (form.invalid || !$("#m_select2_4_1").val()) {
      this._toastr.error(undefined, "Kiêm tra lại thông tin.", { closeButton: true });
      return
    }
    console.log(form.value);
    Helpers.setLoading(true)
    const deposit = form.value as Deposit
    deposit.agencyId = $("#m_select2_4_1").val().toString()
    trimObjectAfterSave(deposit)
    let subs: Subscription
    if (this.currentItem.id) {
      subs = this._serviceDeposit.putDeposits(deposit).subscribe(
        rs => {
          this._serviceDeposit.putDeposits(deposit)
          form.resetForm()
          this._toastr.info('Thay đổi thành công', undefined, { closeButton: true });
        },
        err => {
          Helpers.setLoading(false);
          this._toastr.error(err.error.error.message, undefined, { closeButton: true });
        }
      )
    } else {
      subs = this._serviceDeposit.postDeposits(deposit).subscribe(
        rs => {
          this._toastr.info('Thêm thành công', undefined, { closeButton: true });
          this._serviceDeposit.loadData()
          form.resetForm()
        },
        err => {
          Helpers.setLoading(false);
          this._toastr.error(err.error.error.message, undefined, { closeButton: true });
        }
      )
    }
    this.subsArr.push(subs)
  }

  onDelete(id) {
    Helpers.setLoading(true)
    const sub = this._serviceDeposit.deleteDeposit(id).subscribe(rs => {
      if (rs['count'] !== 0) {
        this._toastr.info('Xóa thành công', undefined, { closeButton: true });
        this._serviceDeposit.loadData()
      }
    })
    this.subsArr.push(sub)
  }

  onEdit(id) {
    this.currentItem = find(this.list, (item) => { return item.id == id })
    $("#m_select2_4_1").val(this.currentItem.agencyId).trigger('change')
  }

  ngOnDestroy(): void {
    Helpers.setLoading(true)
    this.subsArr.forEach(sub => sub.unsubscribe())
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit() {
    this._script.loadScripts('app-deposit',
      [
        'assets/vendors/custom/datatables/datatables.bundle.js',
        'assets/demo/default/custom/crud/datatables/standard/paginations.js',
        'assets/demo/default/custom/crud/forms/validation/form-controls.js'
      ]);
    this.dtTrigger.next();
  }

  loadScript() {
    const dataAgency = this.listAgencies.map(item => {
      return { id: item.agencyCode, text: item.agencyName }
    })

    $("#m_select2_4_1").select2({ data: dataAgency })
    this._script.loadScripts('app-deposit',
      [
        'assets/demo/default/custom/crud/forms/widgets/select2.js'
      ]);
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
