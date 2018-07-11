import {
  Component,
  OnInit,
  AfterViewInit,
  ViewEncapsulation,
  OnDestroy
} from "@angular/core";
import { ScriptLoaderService } from "../../../../../_services/script-loader.service";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs/Subscription";
import { trimObjectAfterSave } from "../../../../../_utils/trimObject";
import { find } from "lodash";
import { ObjectUnsubscribedError, Subject } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { DataTableDirective } from "angular-datatables";
import { ViewChild } from "@angular/core";
import { Helpers } from "../../../../../helpers";
import { ClientTicket } from "../../../../../_models/client-ticket.model";
import { ClientTicketService } from "../../../../../_services/client-ticket.service";
import { emailApprove } from "../../../../../auth/_helpers/fake-email";
@Component({
  selector: "app-approve",
  templateUrl: "./approve.component.html",
  encapsulation: ViewEncapsulation.None,
  styles: []
})
export class ApproveComponent implements OnInit, OnDestroy, AfterViewInit {
  private subsArr: Subscription[];
  list: ClientTicket[];

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  private listStatus: string[] = ["Mới", "Đang xử lý", "Duyệt", "Từ chối"];

  dtOptions: any = {
    responsive: true,
    pagingType: "full_numbers",
    columnDefs: [],
    order: [[0, "desc"]],
    oLanguage: {
      sSearch: "Tìm kiếm",
      sProcessing: "Đang tải ...",
      sLengthMenu: "Xem _MENU_",
      sZeroRecords: "Không tìm thấy mục nào phù hợp",
      sInfo: "Đang xem _START_ đến _END_ trong tổng số _TOTAL_",
      sInfoEmpty: "Đang xem 0 đến 0 trong tổng 0",
      sInfoFiltered: "(Xem _MAX_)"
    }
  };
  dtTrigger = new Subject();
  public currentItem: ClientTicket = {
    clientId: undefined,
    agencyId: undefined,
    ticketId: undefined,
    maDatCho: undefined,
    maXuatVe: undefined,
    soTien: undefined,
    tinhTrangVe: undefined,
    hangBay: undefined,
    sanBayDi_chieuDi: undefined,
    sanBayDen_chieuDi: undefined,
    sanBayDi_chieuVe: undefined,
    sanBayDen_chieuVe: undefined,
    ngayGioBay_chieuDi: undefined,
    ngayGioDen_chieuDi: undefined,
    ngayGioBay_chieuVe: undefined,
    ngayGioDen_chieuVe: undefined,
    _id: undefined,
    createdAt: undefined,
    updatedAt: undefined
  };

  constructor(
    private _script: ScriptLoaderService,
    private _serviceClient: ClientTicketService,
    private _toastr: ToastrService
  ) {}

  ngOnInit() {
    this.subsArr = [];
    Helpers.setLoading(true);

    const sub = this._serviceClient.listClientTicketsChanged.subscribe(
      rs => {
        this.list = rs;
        this.rerender();
      },
      err => {
        console.log(err);
      }
    );
    this._serviceClient.loadData();
    this.subsArr.push(sub);
  }

  onShowModal(id) {
    this.currentItem = find(this.list, item => {
      return item._id == id;
    });
  }

  ngOnDestroy(): void {
    Helpers.setLoading(true);
    this.subsArr.forEach(sub => sub.unsubscribe());
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit() {
    this._script.loadScripts("app-approve", [
      "assets/vendors/custom/datatables/datatables.bundle.js"
    ]);
    this.dtTrigger.next();
  }

  loadScript() {}
  onApprove() {
    this.currentItem.tinhTrangVe = this.listStatus[2];
    let data = { ...this.currentItem } as any;
    data._user = "Le Kim Quy";
    data.email = emailApprove;
    const sub = this._serviceClient
      .changeStatus(this.currentItem)
      .subscribe(rs => {
        return this._serviceClient.sendEmail(data).subscribe(
          rs => {
            console.log(rs);
          },
          err => {
            console.log(err);
          }
        );
      });
    this.subsArr.push(sub);
  }

  onReject() {
    this.currentItem.tinhTrangVe = this.listStatus[3];
    let data = { ...this.currentItem } as any;
    data._user = "Song Thanh Nghia";
    data.email = emailApprove;
    const sub = this._serviceClient
      .changeStatus(this.currentItem)
      .subscribe(rs => {
        return this._serviceClient.sendEmail(data).subscribe(
          rs1 => {
            console.log(rs1);
          },
          err => {
            console.log(err);
          }
        );
      });
    this.subsArr.push(sub);
  }

  rerender() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
      Helpers.setLoading(false);
    });
  }
}
