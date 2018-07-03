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

  listAgencies: Agency[]
  listAccounts: Account[]
  currentAgency: Agency = {
    agencyName: undefined,
    agencyCode: undefined,
    representative: undefined,
    identification: undefined,
    phoneNumber: undefined,
    address: undefined,
    initialBudget: undefined,
    currentBudget: undefined,
    _id: undefined,
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

  public currentItem: DepositProgress = {
    agencyId: undefined,
    expenditure: undefined,
    firstBalance: undefined,
    lastBalance: undefined,
    employeeId: "5b3b9bc66d99d03634925dd7",
    createdAt: undefined,
    updatedAt: undefined,
    deposit: undefined,
    _id: undefined
  }

  constructor(private _script: ScriptLoaderService,
    private _serviceProgress: Progresservice,
    private _serviceAgency: AgencyService,
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

    const agencyApi = this._serviceAgency.getAgenciesObservable()
    const subs2 = agencyApi.subscribe(
      res => {
        console.log('object', res);
        this.listAgencies = res['data'] as Agency[]
        this.loadScript()
      },
      err => {
        console.log(err);
      })

    this.subsArr.push(subs1)
    this.subsArr.push(subs2)
  }

  onSubmit(form: NgForm) {
    // if (form.invalid
    //   || !$("#m_select2_4_1").val()) {
    //   this._toastr.error(undefined, "Kiêm tra lại thông tin.", { closeButton: true });
    //   return
    // }
    Helpers.setLoading(true)
    // const progress = form.value as DepositProgress
    console.log(this.currentItem);
    const data = { ...this.currentItem, ...this.currentAgency }
    console.log('data', data);
    // progress.agencyId = $("#m_select2_4_1").val().toString()
    // progress.depositId = $("#m_select2_4_2").val().toString()
    // progress.employeeId = $("#m_select2_4_3").val().toString()
    // console.log(progress);

    let sub: Subscription
    if (this.currentItem._id) {
      sub = this._serviceProgress.putProgress(this.currentItem).subscribe(
        rs => {
          this._serviceProgress.loadData()
          form.resetForm()
          this.resetForm()
          this._toastr.info('Thay đổi thành công', undefined, { closeButton: true });
        },
        err => {
          Helpers.setLoading(false);
          this._toastr.error(err.error.msg, undefined, {
            closeButton: true
          });
        }
      )
    } else {
      sub = this._serviceProgress.postProgress(this.currentItem).subscribe(
        rs => {
          this._toastr.info('Thêm thành công', undefined, { closeButton: true });
          this._serviceProgress.loadData()
          form.resetForm()
          this.resetForm()
        },
        err => {
          Helpers.setLoading(false);
          this._toastr.error(err.error.msg, undefined, {
            closeButton: true
          });
        }
      )
    }
    this.subsArr.push(sub)
  }

  onChange(val) {
    this.currentAgency = find(this.listAgencies, (item) => { return item._id == val })
    console.log(this.currentAgency);
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

  resetForm() {
    $("#m_select2_4_1").val(0).trigger('change')
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
      return { id: item._id, text: item.agencyCode }
    })
    $("#m_select2_4_1").select2({ data: dataAgency })

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
