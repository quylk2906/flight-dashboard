
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
    _id: undefined,
    createdAt: undefined,
    updatedAt: undefined
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
    private _toastr: ToastrService
  ) {
  }

  ngOnInit() {
    Helpers.setLoading(true)
    this.list = this._service.getClients();
    const sub = this._service.listClientsChanged.subscribe(
      rs => {
        this.list = rs
        this.rerender()
      },
      err => {
        this._toastr.error(err, undefined, { closeButton: true });
      })
    this._service.loadData()
    this.subsArr.push(sub)
  }

  onSubmit(form: NgForm) {
    Helpers.setLoading(true)
    if (form.invalid) {
      return
    }
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
        rs => {
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
        this._toastr.info('Xóa thành công', undefined, { closeButton: true });
        this._service.loadData()
      }
    })
    this.subsArr.push(sub)
  }

  onEdit(id) {
    this.currentItem = find(this.list, (item) => { return item._id == id })
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
        'assets/demo/default/custom/crud/datatables/standard/paginations.js',
        'assets/demo/default/custom/crud/forms/validation/form-controls.js',
        'assets/demo/default/custom/components/base/dropdown.js'
      ]);
    this.dtTrigger.next();
  }
}
