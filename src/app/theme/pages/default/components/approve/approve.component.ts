import { Component, OnInit, AfterViewInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { trimObjectAfterSave } from '../../../../../_utils/trimObject';
import { find } from 'lodash';
import { ObjectUnsubscribedError, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables';
import { ViewChild } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ClientTicket } from '../../../../../_models/client-ticket.model';
import { ClientTicketService } from '../../../../../_services/client-ticket.service';



@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: []
})
export class ApproveComponent implements OnInit, OnDestroy, AfterViewInit {
  private subsArr: Subscription[]
  list: ClientTicket[]
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  private listStatus: string[] = ['None', 'In Process', 'Approved', 'Rejected']
  dtOptions: DataTables.Settings = {
    responsive: true,
    pagingType: "full_numbers",
    columnDefs: [
    ],
    order: [[0, "desc"]]
  };
  dtTrigger = new Subject();
  public currentItem: ClientTicket = {
    clientId: undefined,
    maDatCho: undefined,
    maXuatVe: undefined,
    soTien: undefined,
    tinhTrangVe: undefined,
    hangBay: undefined,
    sanBayDi_chieuDi: undefined,
    sanBayDen_chieuDi: undefined,
    sanBayDi_chieuVe: undefined,
    sanBayDen_chieuVe: undefined,
    gioBay_chieuDi: undefined,
    gioDen_chieuDi: undefined,
    gioBay_chieuVe: undefined,
    gioDen_chieuVe: undefined,
    ngayBay_chieuDi: undefined,
    ngayDen_chieuDi: undefined,
    ngayBay_chieuVe: undefined,
    ngayDen_chieuVe: undefined,
    id: undefined,
    createdAt: undefined,
    updatedAt: undefined
  }

  constructor(private _script: ScriptLoaderService,
    private _serviceClient: ClientTicketService,
    private _toastr: ToastrService
  ) {
  }


  ngOnInit() {
    this.subsArr = []
    Helpers.setLoading(true)

    this.list = this._serviceClient.getClients()
    this._serviceClient.loadData()


    const sub1 = this._serviceClient.listClientTicketsChanged.subscribe(
      rs => {
        this.list = rs
        console.log(rs);
        this.rerender()
      },
      err => {
        console.log(err);
      })

  }

  // onDelete(id) {
  //   Helpers.setLoading(true)
  //   const sub = this._serviceClient.deleteDeposit(id).subscribe(rs => {
  //     if (rs['count'] !== 0) {
  //       this._toastr.info('Xóa thành công', undefined, { closeButton: true });
  //       this._serviceClient.loadData()
  //     }
  //   })
  //   this.subsArr.push(sub)
  // }

  onShowModal(id) {
    this.currentItem = find(this.list, (item) => { return item.id == id })
  }
  // onEdit(id) {
  //   this.currentItem = find(this.list, (item) => { return item.id == id })
  //   $("#m_select2_4_1").val(this.currentItem.agencyId).trigger('change')
  // }

  ngOnDestroy(): void {
    Helpers.setLoading(true)
    this.subsArr.forEach(sub => sub.unsubscribe())
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit() {
    this._script.loadScripts('app-approve',
      [
        'assets/vendors/custom/datatables/datatables.bundle.js',
        'assets/demo/default/custom/crud/datatables/standard/paginations.js',
        'assets/demo/default/custom/crud/forms/validation/form-controls.js'
      ]);
    this.dtTrigger.next();
  }

  loadScript() {
    // const dataAgency = this.listAgencies.map(item => {
    //   return { id: item.agencyCode, text: item.agencyName }
    // })

    // $("#m_select2_4_1").select2({ data: dataAgency })
    // this._script.loadScripts('app-approve',
    //   [
    //     'assets/demo/default/custom/crud/forms/widgets/select2.js'
    //   ]);
  }

  onApprove() {
    this.currentItem.tinhTrangVe = this.listStatus[2]
    const sub = this._serviceClient.putClient(this.currentItem).subscribe(rs => {
    })
    this.subsArr.push(sub)
  }

  onReject() {
    this.currentItem.tinhTrangVe = this.listStatus[3]
    const sub = this._serviceClient.putClient(this.currentItem).subscribe(rs => {
    })
    this.subsArr.push(sub)
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
