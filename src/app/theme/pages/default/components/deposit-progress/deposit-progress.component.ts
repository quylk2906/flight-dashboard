import { Component, OnInit, AfterViewInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { trimObjectAfterSave } from '../../../../../_utils/trimObject';
import { find } from 'lodash';
import { Progresservice } from '../../../../../_services/deposit-progress.service';
import { AgencyService } from '../../../../../_services/agency.service';
import { DepositService } from '../../../../../_services/deposit.service';
import { ToastrService } from 'ngx-toastr';
import { DepositProgress } from '../../../../../_models/deposit-progress';
import { AccountService } from '../../../../../_services/account.service';
import { Agency } from '../../../../../_models/agency.model';
import { Deposit } from '../../../../../_models/deposit.model';
import { DataTableDirective } from 'angular-datatables';
import { ViewChild } from '@angular/core';
import { Subject, forkJoin } from 'rxjs';
import { Helpers } from '../../../../../helpers';
import { Account } from '../../../../../_models/account.model';

@Component({
  selector: 'app-deposit-progress',
  templateUrl: './deposit-progress.component.html',
  encapsulation: ViewEncapsulation.None
})

export class DepositProgressComponent implements OnInit, OnDestroy, AfterViewInit {
  public list: DepositProgress[]
  private subsArr: Subscription[]

  listDeposits: Deposit[]
  listAgencies: Agency[]
  listAccounts: Account[]

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

  public currentItem: DepositProgress = {
    agencyId: undefined,
    depositId: undefined,
    expenditure: undefined,
    firstBalance: undefined,
    lastBalance: undefined,
    employeeId: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    id: undefined
  }

  constructor(private _script: ScriptLoaderService,
    private _serviceProgress: Progresservice,
    private _serviceAgency: AgencyService,
    private _serviceDeposit: DepositService,
    private _serviceAccount: AccountService,
    private _toastr: ToastrService
  ) {
  }


  ngOnInit() {
    this.subsArr = []
    Helpers.setLoading(true)

    this.list = this._serviceProgress.getProgress()
    this._serviceProgress.loadData()

    const subs1 = this._serviceProgress.listProgressChanged.subscribe(
      rs => {
        this.list = rs
        this.rerender()
      },
      err => {
        console.log(err);
      })

    const accountApi = this._serviceAccount.getAirportsObservable()
    const agencyApi = this._serviceAgency.getAgenciesObservable()
    const depositApi = this._serviceDeposit.getDepositsObservable()
    const subs2 = forkJoin(accountApi, agencyApi, depositApi).subscribe(
      res => {
        console.log('object', res);
        this.listAccounts = res[0] as Account[]
        this.listAgencies = res[1] as Agency[]
        this.listDeposits = res[1] as Deposit[]
        this.loadScript()
      },
      err => {
        console.log(err);
      })

    this.subsArr.push(subs1)
    this.subsArr.push(subs2)
  }

  onSubmit(form: NgForm) {
    if (form.invalid
      || !$("#m_select2_4_1").val()
      || !$("#m_select2_4_2").val()
      || !$("#m_select2_4_3").val()) {
      this._toastr.error(undefined, "Kiêm tra lại thông tin.", { closeButton: true });
      return
    }
    Helpers.setLoading(true)
    const progress = form.value as DepositProgress
    progress.agencyId = $("#m_select2_4_1").val().toString()
    progress.depositId = $("#m_select2_4_2").val().toString()
    progress.employeeId = $("#m_select2_4_3").val().toString()
    trimObjectAfterSave(progress)
    let sub: Subscription
    if (this.currentItem.id) {
      sub = this._serviceProgress.putProgress(progress).subscribe(
        rs => {
          this._serviceProgress.loadData()
          form.resetForm()
          this.resetForm()
          this._toastr.info('Thay đổi thành công', undefined, { closeButton: true });
        },
        err => {
          Helpers.setLoading(false);
          this._toastr.error(err.error.error.message, undefined, { closeButton: true });
        }
      )
    } else {
      sub = this._serviceProgress.postProgress(progress).subscribe(
        rs => {
          this._toastr.info('Thêm thành công', undefined, { closeButton: true });
          this._serviceProgress.loadData()
          form.resetForm()
          this.resetForm()
        },
        err => {
          Helpers.setLoading(false);
          this._toastr.error(err.error.error.message, undefined, { closeButton: true });
        }
      )
    }
    this.subsArr.push(sub)
  }

  onDelete(id) {
    Helpers.setLoading(true)
    const sub = this._serviceProgress.deleteProgress(id).subscribe(rs => {
      if (rs['count'] !== 0) {
        this._toastr.info('Xóa thành công', undefined, { closeButton: true });
        this._serviceProgress.loadData()
      }
    })
    this.subsArr.push(sub)
  }

  resetForm () {
    $("#m_select2_4_1").val(0).trigger('change')
    $("#m_select2_4_2").val(0).trigger('change')
    $("#m_select2_4_3").val(0).trigger('change')
  }
  // onEdit(id) {
  //   // this.currentItem = find(this.list, (item) => {
  //   //   return item.id == id
  //   // })
  // }

  ngOnDestroy(): void {
    Helpers.setLoading(true)
    this.subsArr.forEach(sub => sub.unsubscribe())
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit() {
    this._script.loadScripts('app-deposit-progress',
      [
        'assets/vendors/custom/datatables/datatables.bundle.js',
        'assets/demo/default/custom/crud/datatables/standard/paginations.js',
        'assets/demo/default/custom/crud/forms/validation/form-controls.js'
      ]);
    this.dtTrigger.next();
  }

  loadScript() {
    const dataAgency = this.listAgencies.map(item => {
      return { id: item.agencyCode, text: item.agencyCode }
    })
    const dataAccount = this.listAccounts.map(item => {
      return { id: item.id, text: item.username }
    })
    const dataDeposit = this.listDeposits.map(item => {
      return { id: item.id, text: `KQ-${item.id}` }
    })

    $("#m_select2_4_1").select2({ data: dataAgency })
    $("#m_select2_4_2").select2({ data: dataDeposit })
    $("#m_select2_4_3").select2({ data: dataAccount })

    this._script.loadScripts('app-deposit-progress',
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
