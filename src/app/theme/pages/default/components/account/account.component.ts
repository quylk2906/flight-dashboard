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
import { ObjectUnsubscribedError, Subject, forkJoin } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { Helpers } from "../../../../../helpers";
import { Agency } from "../../../../../_models/agency.model";
import { AgencyService } from "../../../../../_services/agency.service";
import { DataTableDirective } from "angular-datatables";
import { ViewChild } from "@angular/core";
import { Account } from "../../../../../_models/account.model";
import { AccountService } from "../../../../../_services/account.service";
import { Position } from "../../../../../_models/position.model";
import { PositionService } from "../../../../../_services/position.service";

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  encapsulation: ViewEncapsulation.None,
  styles: []
})
export class AccountComponent implements OnInit, OnDestroy, AfterViewInit {
  public list: Account[];
  public listAgency: Agency[];
  public listPositions: Position[];
  private subsArr: Subscription[] = [];
  public listStatus = [
    { title: "Kíck hoạt", value: true },
    { title: "Ẩn", value: false }
  ];
  public listRole = [{ title: "Quản tri", value: 0 }, { title: "Người dùng", value: 1 }];
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
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

  public currentItem: Account = {
    _id: undefined,
    agencyId: undefined,
    fullName: undefined,
    role: 1,
    isActived: true,
    username: undefined,
    email: undefined,
    emailNotification: undefined,
    createdAt: undefined,
    password2: undefined,
    password: undefined,
    gender: false,
    age: undefined,
    faxNumber: undefined,
    timeJoin: undefined,
    degree: undefined,
    languages: undefined

  };
  constructor(
    private _script: ScriptLoaderService,
    private _toastr: ToastrService,
    private _serviceAgency: AgencyService,
    private _serviceAccount: AccountService,
    private _servicePosition: PositionService
  ) { }

  ngOnInit() {
    Helpers.setLoading(true);
    this.list = this._serviceAccount.getAccounts();
    const sub1 = this._serviceAccount.listAccountshanged.subscribe(
      rs => {
        console.log(rs);
        this.list = rs;
        this.rerender();
      },
      err => {
        this._toastr.error(err, undefined, { closeButton: true });
      }
    );

    const agentApi = this._serviceAgency.getAgenciesObservable()
    const positionApi = this._servicePosition.getPositionsObservable()
    const sub2 = forkJoin([agentApi, positionApi]).subscribe(rs => {
      console.log(rs);
      this.listAgency = rs[0]["data"];
      this.listPositions = rs[1]["data"];
      this.loadScript();
    });
    this.subsArr.push(sub1);
    this.subsArr.push(sub2);
    this._serviceAccount.loadData();
  }

  onSelectionChange(value) {
    this.currentItem.gender = value
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return
    }
    const account = this.currentItem;
    if (this.currentItem.role !== 0) {
      account.agencyId = $("#m_select2_4_1")
        .val()
        .toString();
    }

    Helpers.setLoading(true);

    let sub: Subscription;
    if (account._id) {
      sub = this._serviceAccount.putAccount(account).subscribe(
        rs => {
          this._serviceAccount.loadData();
          form.resetForm();
          this._toastr.info("Thay đổi thành công", undefined, {
            closeButton: true
          });
        },
        err => {
          this._toastr.info("Thêm thành công", undefined, {
            closeButton: true
          });
          Helpers.setLoading(false);
        }
      );
    } else {
      sub = this._serviceAccount.postAccount(account).subscribe(
        rs => {
          this._serviceAccount.loadData();
          form.resetForm();
          this._toastr.info("Thêm thành công", undefined, {
            closeButton: true
          });
        },
        err => {
          this._toastr.info("Thêm thành công", undefined, {
            closeButton: true
          });
          Helpers.setLoading(false);
        }
      );
    }

    $("#m_select2_4_1")
      .val(0)
      .trigger("change");

    this.subsArr.push(sub);
  }

  onDelete(id) {
    console.log(id);
    const sub = this._serviceAccount.deletetAccount(id).subscribe(rs => {
      if (rs["count"] !== 0) {
        this._toastr.info("Xóa thành công", undefined, { closeButton: true });
        this._serviceAccount.loadData();
      }
    });
    this.subsArr.push(sub);
  }

  onActive(id, status) { }

  onEdit(id) {
    this.currentItem = find(this.list, item => {
      return item._id == id;
    });
    let obj = this.currentItem.agencyId as any
    $("#m_select2_4_1")
      .val(obj ? obj._id : 0)
      .trigger("change");
  }

  ngOnDestroy() {
    this.subsArr.forEach(sub => sub.unsubscribe());
    Helpers.setLoading(true);
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit() {
    this._script.loadScripts("app-account", [
      "assets/vendors/custom/datatables/datatables.bundle.js",
      "assets/demo/default/custom/crud/datatables/standard/paginations.js",
      "assets/demo/default/custom/crud/forms/validation/form-controls.js"
    ]);
    this.dtTrigger.next();
  }

  loadScript() {
    const dataAgency = this.listAgency.map(item => {
      return { id: item._id, text: `${item.agencyCode} - ${item.agencyName}` };
    });
    $("#m_select2_4_1").select2({ data: dataAgency });
    this._script.loadScripts("app-account", [
      "assets/demo/default/custom/crud/forms/widgets/select2.js"
    ]);
  }

  rerender() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
      Helpers.setLoading(false);
    });
  }
}
