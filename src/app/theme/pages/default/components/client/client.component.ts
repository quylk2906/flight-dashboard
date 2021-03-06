
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
import { ToastrService } from 'ngx-toastr';
import { AgencyService } from '../../../../../_services/agency.service';
import { Agency } from '../../../../../_models/agency.model';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ClientComponent implements OnInit, OnDestroy, AfterViewInit {
  public list: Client[]
  public listRegions: any[];
  public listAgencies: Agency[];
  public user: any
  private subsArr: Subscription[] = []
  public currentItem: Client = {
    fullName: undefined,
    phoneNumber: undefined,
    address: undefined,
    _id: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    clientId: undefined,
    agencyId: undefined,
    identification: undefined,
    gender: false,
    region: undefined,
    passport: undefined,
    birthPlace: undefined,
    country: undefined
  }

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {
    responsive: true,
    pagingType: "full_numbers",
    columnDefs: [],
    order: [[0, "desc"]],
    oLanguage: {
      "sSearch": "Tìm kiếm",
      "sProcessing": "Đang tải ...",
      "sLengthMenu": "Xem _MENU_",
      "sZeroRecords": "Không tìm thấy mục nào phù hợp",
      "sInfo": "Đang xem _START_ đến _END_ trong tổng số _TOTAL_",
      "sInfoEmpty": "Đang xem 0 đến 0 trong tổng 0",
      "sInfoFiltered": "(Xem _MAX_)"
    }
  };
  dtTrigger = new Subject();

  constructor(private _script: ScriptLoaderService,
    private _service: ClientService,
    private _serviceAgency: AgencyService,
    private _toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('currentUser'))
    Helpers.setLoading(true)
    this.list = this._service.getClients();
    this.listRegions = this._service.getAllRegions()
    const sub = this._service.listClientsChanged.subscribe(
      rs => {
        this.list = rs
        this.rerender()
      },
      err => {
        this._toastr.error(err, undefined, { closeButton: true });
      })
    this._service.loadData()
    const sub1 = this._serviceAgency.getAgenciesObservable().subscribe(rs => {
      console.log('rs', rs);
      this.listAgencies = rs['data'] as Agency[]
      this.loadScript()
    })
    this.subsArr.push(sub)
    this.subsArr.push(sub1)
  }

  onSelectionChange(value) {
    this.currentItem.gender = value
  }

  onSubmit(form: NgForm) {
    // if (form.invalid) {
    //   return
    // }
    Helpers.setLoading(true)
    this.currentItem.region = $("#m_select2_4_2").val().toString();
    this.currentItem.agencyId = $("#m_select2_4_1").val() ? $("#m_select2_4_1").val().toString() : this.user.agencyId;

    if (!this.currentItem.identification)
      this._toastr.warning('Bạn không có CMND', undefined, undefined);

    let sub: Subscription

    if (this.currentItem._id) {
      sub = this._service.putClient(this.currentItem).subscribe(
        rs => {
          this._service.loadData()
          form.resetForm()
          this._toastr.info('Thay đổi thành công', undefined, { closeButton: true });
        },
        err => {
          this._toastr.error(err.error.msg, undefined, {
            closeButton: true
          });
          Helpers.setLoading(false)
        }
      )
    } else {
      sub = this._service.postClient(this.currentItem).subscribe(
        () => {
          this._service.loadData()
          form.resetForm()
          this._toastr.info('Thêm thành công', undefined, { closeButton: true });
        },
        err => {
          this._toastr.error(err.error.msg, undefined, {
            closeButton: true
          });
          Helpers.setLoading(false)
        }
      )
    }
    this.subsArr.push(sub)
  }

  onDelete(id) {
    Helpers.setLoading(true)
    const sub = this._service.deleteClient(id).subscribe(rs => {
      if (rs['count'] !== 0) {
        this._toastr.success('Xóa thành công', undefined, { closeButton: true });
        this._service.loadData()
      }
    })
    this.subsArr.push(sub)
  }

  onEdit(id) {
    this.currentItem = find(this.list, (item) => { return item._id == id })
    $("#m_select2_4_2")
      .val(this.currentItem.region)
      .trigger("change");
  }

  ngOnDestroy() {
    Helpers.setLoading(true)
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
        'assets/demo/default/custom/crud/forms/validation/form-controls.js',
        'assets/demo/default/custom/components/base/dropdown.js',
        "assets/demo/default/custom/crud/forms/widgets/select2.js"
      ]);

    this.dtTrigger.next();
  }

  loadScript() {
    const dataRegions = this.listRegions.map(item => {
      return { id: item.name, text: item.name };
    });

    const dataAgencies = this.listAgencies.map(item => {
      return { id: item._id, text: `${item.agencyCode} - ${item.agencyName}` };
    });

    $("#m_select2_4_2").select2({ data: dataRegions });
    $("#m_select2_4_1").select2({ data: dataAgencies });

    this._script.loadScripts('app-client',
      ["assets/demo/default/custom/crud/forms/widgets/select2.js"]);

    // $("#m_select2_4_1")
    //   .val(this.user.agencyId)
    //   .trigger("change");
  }

}
