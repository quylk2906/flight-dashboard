import {
  Component,
  OnInit,
  AfterViewInit,
  ViewEncapsulation,
  OnDestroy,
  ViewChild
} from "@angular/core";
import { ScriptLoaderService } from "../../../../../_services/script-loader.service";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs/Subscription";
import { trimObjectAfterSave } from "../../../../../_utils/trimObject";
import { find } from "lodash";
import { Helpers } from "../../../../../helpers";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs/Subject";
import { ToastrService } from "ngx-toastr";
import { Airline } from "../../../../../_models/airline.module";
import { AirlineService } from "../../../../../_services/airline.service";

@Component({
  selector: "app-airline",
  templateUrl: "./airline.component.html",
  encapsulation: ViewEncapsulation.None
})
export class AirlineComponent implements OnInit, OnDestroy, AfterViewInit {
  private subsArr: Subscription[] = [];
  public list: Airline[];
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  dtOptions: any = {
    responsive: !0,
    pagingType: "full_numbers",
    columnDefs: [],
    order: [[0, "desc"]],
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
    }
  };
  dtTrigger = new Subject();

  public currentItem: Airline = {
    airlineName: undefined,
    airlineCode: undefined,
    _id: undefined,
    createdAt: undefined,
    updatedAt: undefined
  };

  constructor(
    private _script: ScriptLoaderService,
    private _service: AirlineService,
    private _toastr: ToastrService
  ) { }

  ngOnInit() {
    Helpers.setLoading(true);
    this.list = this._service.getAirlines();
    const sub = this._service.listAirlinesChanged.subscribe(
      rs => {
        this.list = rs;
        this.rerender();
      },
      err => {
        this._toastr.error(err, undefined, { closeButton: true });
      }
    );
    this.subsArr.push(sub);
    this._service.loadData();
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    Helpers.setLoading(true);
    let sub: Subscription;
    console.log(this.currentItem);
    if (this.currentItem._id) {
      sub = this._service.putAirline(this.currentItem).subscribe(
        rs => {
          console.log(rs);
          this._service.loadData();
          form.resetForm();
          this._toastr.info("Thay đổi thành công", undefined, {
            closeButton: true
          });
        },
        err => {
          this._toastr.error(err.error.msg, undefined, {
            closeButton: true
          });
          Helpers.setLoading(false);
        }
      );
    } else {
      sub = this._service.postAirline(this.currentItem).subscribe(
        rs => {
          this._service.loadData();
          form.resetForm();
          this._toastr.info("Thêm thành công", undefined, {
            closeButton: true
          });
        },
        err => {
          console.log(err);
          this._toastr.error(err.error.msg, undefined, {
            closeButton: true
          });
          Helpers.setLoading(false);
        }
      );
    }
    this.subsArr.push(sub);
  }

  onDelete(id) {
    console.log(id);
    const sub = this._service.deleteAirline(id).subscribe(rs => {
      if (rs["count"] !== 0) {
        // you have to call api to reload datable without reload page
        this._toastr.success("Xóa thành công", undefined, { closeButton: true });
        this._service.loadData();
      }
    });
    this.subsArr.push(sub);
  }

  onEdit(id) {
    console.log(id);
    this.currentItem = find(this.list, item => {
      return item._id == id;
    });
  }

  ngOnDestroy() {
    this.subsArr.forEach(sub => sub.unsubscribe());
    Helpers.setLoading(true);
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit() {
    this._script.loadScripts("app-airline", [
      "assets/vendors/custom/datatables/datatables.bundle.js",
      "assets/demo/default/custom/crud/datatables/standard/paginations.js",
      "assets/demo/default/custom/crud/forms/validation/form-controls.js"
    ]);
    this.dtTrigger.next();
  }

  rerender() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
      Helpers.setLoading(false);
    });
  }
}
