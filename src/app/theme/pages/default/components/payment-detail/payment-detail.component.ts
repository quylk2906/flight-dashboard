import { Component, OnInit, AfterViewInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs';
import { PaymentDetail } from '../../../../../_models/payment-detail.model';
import { PaymentDetailService } from '../../../../../_services/payment-detail.service';
import { DataTableDirective } from 'angular-datatables';

import * as moment from 'moment';
import { ViewChild } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-detail',
  templateUrl: './payment-detail.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: []
})
export class PaymentDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  private subsArr: Subscription[]
  public list: PaymentDetail[]
  public currentItem: PaymentDetail = {
    agencyId: undefined,
    tacDong: undefined,
    firstBalance: undefined,
    lastBalance: undefined,
    amount: undefined,
    createdAt: undefined,
    updatedAt: undefined
  }

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  private listStatus: string[] = ['None', 'In Process', 'Approved', 'Rejected']
  myMoment: moment.Moment = moment(Date.now());
  dtOptions: any = {
    responsive: true,
    pagingType: "full_numbers",
    columnDefs: [
    ],
    search: {
      "search": ""
    },
    oLanguage: {
      "sSearch": "Tìm kiếm",
      "sProcessing": "Đang tải ...",
      "sLengthMenu": "Xem _MENU_",
      "sZeroRecords": "Không tìm thấy mục nào phù hợp",
      "sInfo": "Đang xem _START_ đến _END_ trong tổng số _TOTAL_",
      "sInfoEmpty": "Đang xem 0 đến 0 trong tổng 0",
      "sInfoFiltered": "(Xem _MAX_)"
    },
    order: [[0, "desc"]],
    dom: "<'row'<'col-sm-6 text-left'f><'col-sm-6 text-right'B>>\n\t\t\t<'row'<'col-sm-12'tr>>\n\t\t\t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 dataTables_pager'lp>>",
    buttons: [
      {
        extend: "print",
        text: "Print",
        title: "Flight - " + this.myMoment.format('MMMM Do YYYY, h:mm:ss a'),
        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5]
        },
        exportData: { decodeEntities: true },
        customize: function (win) {
          $(win.document.body)
            .css('padding', '10px')
        }
      },
      {
        extend: "excelHtml5",
        text: "Excel",
        title: "Flight - " + this.myMoment.format('MMMM Do YYYY, h:mm:ss a') + ".xlsx",
        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5]
        },
        exportData: { decodeEntities: true }
      },
      {
        extend: "pdfHtml5",
        text: "Pdf",
        title: "Flight - " + this.myMoment.format('MMMM Do YYYY, h:mm:ss a') + ".pdf",
        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5]
        },
        exportData: { decodeEntities: true }
      },

    ],
  };
  dtTrigger = new Subject();
  constructor(private _script: ScriptLoaderService,
    private _service: PaymentDetailService,
    private route: ActivatedRoute) {
  }


  ngOnInit() {
    this.subsArr = []
    this.list = this._service.getClients()
    const sub = this._service.listPaymentChanged.subscribe(rs => {
      this.list = rs
      console.log(rs);
      this.rerender()
    })
    this._service.loadData();
    this.subsArr.push(sub)
    // this.subsArr.push(sub2)
  }

  ngOnDestroy() {
    this.subsArr.forEach(sub => sub.unsubscribe());
    this.dtTrigger.unsubscribe();
  }

  rerender() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
      Helpers.setLoading(false);
    });
  }


  ngAfterViewInit() {
    this._script.loadScripts("app-payment-detail", [
      "assets/vendors/custom/datatables/datatables.bundle.js"
    ]);
    console.log(this.route.snapshot.params['id']);
    this.dtOptions.search.search = this.route.snapshot.params['id']
    this.dtTrigger.next();
  }
}
