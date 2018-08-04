import { Component, OnInit, AfterViewInit, ViewEncapsulation, OnDestroy } from "@angular/core";
import { ScriptLoaderService } from "../../../../../_services/script-loader.service";
import { Subscription } from "rxjs/Subscription";
import { Subject } from "rxjs";
import { PaymentDetail } from "../../../../../_models/payment-detail.model";
import { PaymentDetailService } from "../../../../../_services/payment-detail.service";
import { DataTableDirective } from "angular-datatables";

import * as moment from "moment";
import { ViewChild } from "@angular/core";
import { Helpers } from "../../../../../helpers";
import { ActivatedRoute } from "@angular/router";
import { Agency } from "../../../../../_models/agency.model";
import { AgencyService } from "../../../../../_services/agency.service";

@Component({
  selector: "app-payment-detail",
  templateUrl: "./payment-detail.component.html",
  encapsulation: ViewEncapsulation.None,
  styles: []
})
export class PaymentDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  private subsArr: Subscription[];
  public list: PaymentDetail[];
  // public listStatus: string[] = ["Mới", "Đang xử lý", "Duyệt", "Từ chối"];
  public listStatus = [{ title: "Duyệt", checked: false }, { title: "Từ chối", checked: false }];
  public listReport = [
    { title: "Tất cả", value: 0 },
    { title: "Báo cáo giao dịch đại lý", value: 1 },
    { title: "Báo cáo chi tiết doanh thu", value: 2 },
    { title: "Báo cáo tình trạng đại lý", value: 3 },
    { title: "Báo cáo quỹ đại lý", value: 4 },
    { title: "Báo cáo số tình trạng vé", value: 5 }]
  private listAgencies: Agency[];
  public defaultReport = this.listReport[0]
  public currentItem: PaymentDetail = {
    agencyId: undefined,
    accountId: undefined,
    tacDong: undefined,
    firstBalance: undefined,
    lastBalance: undefined,
    amount: undefined,
    createdAt: undefined,
    updatedAt: undefined
  };

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  myMoment: moment.Moment = moment(Date.now());
  dtOptions: any = {
    responsive: true,
    pagingType: "full_numbers",
    columnDefs: [],
    search: {
      search: ""
    },
    oLanguage: {
      sSearch: "Tìm kiếm",
      sProcessing: "Đang tải ...",
      sLengthMenu: "Xem _MENU_",
      sZeroRecords: "Không tìm thấy mục nào phù hợp",
      sInfo: "Đang xem _START_ đến _END_ trong tổng số _TOTAL_",
      sInfoEmpty: "Đang xem 0 đến 0 trong tổng 0",
      sInfoFiltered: "(Xem _MAX_)"
    },
    order: [[0, "desc"]],
    dom: "<'row'<'col-sm-6 text-left'f><'col-sm-6 text-right'B>>\n\t\t\t<'row'<'col-sm-12'tr>>\n\t\t\t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 dataTables_pager'lp>>",
    buttons: [
      {
        extend: "print",
        text: "Print",
        title: "Flight - " + this.myMoment.format("MMMM Do YYYY, h:mm:ss a"),
        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5]
        },
        exportData: { decodeEntities: true },
        customize: function (win) {
          $(win.document.body).css("padding", "10px");
        }
      },
      {
        extend: "excelHtml5",
        text: "Excel",
        title: "Flight - " + this.myMoment.format("MMMM Do YYYY, h:mm:ss a") + ".xlsx",
        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5]
        },
        exportData: { decodeEntities: true }
      },
      {
        extend: "pdfHtml5",
        text: "Pdf",
        title: "Flight - " + this.myMoment.format("MMMM Do YYYY, h:mm:ss a") + ".pdf",
        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5]
        },
        exportData: { decodeEntities: true }
      }
    ]
  };
  dtTrigger = new Subject();
  constructor(private _script: ScriptLoaderService, private _service: PaymentDetailService, private route: ActivatedRoute,
    private _serviceAgency: AgencyService) { }

  ngOnInit() {
    this.subsArr = [];
    this.list = this._service.getClients();
    const sub1 = this._service.listPaymentChanged.subscribe(rs => {
      this.list = rs;
      this.rerender();
    });

    const sub2 = this._serviceAgency.getAgenciesObservable().subscribe(rs => {
      this.listAgencies = rs['data']
      this.loadScript()
    })

    this._service.loadData();
    this.subsArr.push(sub1);
    this.subsArr.push(sub2)
    // this.subsArr.push(sub2)
  }

  changeTypeReport(type) {
    if (type.value === 0) {
      this.onReset()
    }
    this.defaultReport = type
  }

  ngOnDestroy() {
    this.subsArr.forEach(sub => sub.unsubscribe());
    this.dtTrigger.unsubscribe();
  }

  onSelectAll() {
  }

  onSearch() {
    Helpers.setLoading(true);
    const agencies = $('#m_select2_4_1').val()
    const start = $('input[name=start]').val()
    const end = $('input[name=end]').val()
    const gtlt = $('input[name=gtlt]:checked').val()
    const amount = $('input[name=amount]').val()
    const status = this.listStatus.filter(el => el.checked == true).map(el => el.title)
    const data = {
      agencies: agencies,
      start,
      end,
      gtlt,
      amount,
      status: status
    }

    if (this.defaultReport.value === 0) {
      const sub6 = this._service.getPaymentDetailObservable().subscribe(rs => {
        this.list = rs["data"] as PaymentDetail[];
        this.rerender();
      })
      this.subsArr.push(sub6)
    } else {
      const sub7 = this._service.getPaymentByCondition(data).subscribe(rs => {
        this.list = rs["data"] as PaymentDetail[];
        this.rerender();
      })
      this.subsArr.push(sub7)
    }

  }
  onReset() {
    this.defaultReport = this.listReport[0]
    $("#m_select2_4_1")
      .val(0)
      .trigger("change");
    $('input[name=start]').val("")
    $('input[name=end]').val("")
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
      "assets/vendors/custom/datatables/datatables.bundle.js",
      "assets/demo/default/custom/crud/datatables/search-options/advanced-search.js"
    ]);
    this.dtOptions.search.search = this.route.snapshot.params["id"];
    this.dtTrigger.next();
  }

  loadScript() {
    const dataAgencies = this.listAgencies.map(item => {
      return { id: item._id, text: `${item.agencyCode} - ${item.agencyName}` };
    });

    $("#m_select2_4_1").select2({ data: dataAgencies });
    this._script.loadScripts("app-client-ticket", ["assets/demo/default/custom/crud/forms/widgets/select2.js"]);
  }

}
