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
import { AirportService } from "../../../../../_services/airport.service";
import { Subscription } from "rxjs/Subscription";
import { Airport } from "../../../../../_models/airport.model";
import { trimObjectAfterSave } from "../../../../../_utils/trimObject";
import { find } from "lodash";
import { Helpers } from "../../../../../helpers";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs/Subject";
import { ToastrService } from "ngx-toastr";
import { Select2 } from "select2";
@Component({
  selector: "app-airport",
  templateUrl: "./airport.component.html",
  encapsulation: ViewEncapsulation.None
})
export class AirportComponent implements OnInit, OnDestroy, AfterViewInit {
  private subsArr: Subscription[] = [];
  public list: Airport[];
  public listRegions: any[];
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

  public currentItem: Airport = {
    airportCode: undefined,
    airportName: undefined,
    _id: undefined,
    createdAt: undefined,
    airportRegion: undefined,
    airportCountry: undefined,
  };

  constructor(
    private _script: ScriptLoaderService,
    private _service: AirportService,
    private _toastr: ToastrService
  ) { }

  ngOnInit() {
    Helpers.setLoading(true);
    this.list = this._service.getAirports();
    this.listRegions = this._service.getAllRegions()

    const sub = this._service.listAirportsChanged.subscribe(
      rs => {
        this.list = rs;
        this.rerender();
        this.clearSelect2()
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

    this.currentItem = trimObjectAfterSave(form.value);
    this.currentItem.airportRegion = $("#m_select2_4_1").val().toString();

    let sub: Subscription;
    if (this.currentItem._id) {
      sub = this._service.putAirport(this.currentItem).subscribe(
        rs => {
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
      sub = this._service.postAirport(this.currentItem).subscribe(
        rs => {
          this._service.loadData();
          form.resetForm();
          this._toastr.info("Thêm thành công", undefined, {
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
    }
    this.subsArr.push(sub);
  }

  onDelete(id) {
    const sub = this._service.deleteAirport(id).subscribe(rs => {
      if (rs["count"] !== 0) {
        this._toastr.info("Xóa thành công", undefined, { closeButton: true });
        this._service.loadData();
        this.clearSelect2()
      }
    });
    this.subsArr.push(sub);
  }

  onEdit(id) {
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
    this._script.loadScripts("app-airport", [
      "assets/vendors/custom/datatables/datatables.bundle.js",
      "assets/demo/default/custom/crud/forms/validation/form-controls.js"
    ]);
    this.dtTrigger.next();
    this.loadScript()
  }

  clearSelect2() {
    $("#m_select2_4_1")
      .val(0)
      .trigger("change");
  }

  loadScript() {
    const dataRegions = this.listRegions.map(item => {
      return { id: item.name, text: item.name };
    });

    $("#m_select2_4_1").select2({ data: dataRegions });

    this._script.loadScripts("app-airport", [
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
