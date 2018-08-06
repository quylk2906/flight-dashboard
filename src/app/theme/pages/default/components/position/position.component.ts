import { Component, OnInit, AfterViewInit, ViewEncapsulation, OnDestroy } from "@angular/core";
import { ScriptLoaderService } from "../../../../../_services/script-loader.service";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs/Subscription";
import { trimObjectAfterSave } from "../../../../../_utils/trimObject";
import { find } from "lodash";
import { Helpers } from "../../../../../helpers";
import { Subject } from "rxjs/Subject";
import { ToastrService } from "ngx-toastr";
import { PositionService } from "../../../../../_services/position.service";
import { Position } from "../../../../../_models/position.model";

@Component({
  selector: "app-position",
  templateUrl: "./position.component.html",
  encapsulation: ViewEncapsulation.None
})
export class PositionComponent implements OnInit, OnDestroy, AfterViewInit {
  private subsArr: Subscription[] = [];
  public list: Position[];
  public listRegions: any[];

  public currentItem: Position = {
    _id: undefined,
    titleDivision: undefined,
    codeDivision: undefined,
    fullName: undefined,
    createdAt: undefined
  };

  constructor(private _script: ScriptLoaderService, private _service: PositionService, private _toastr: ToastrService) {}

  ngOnInit() {
    Helpers.setLoading(true);
    this.list = this._service.getPositions();
    const sub = this._service.listPositionsChanged.subscribe(
      rs => {
        this.list = rs;
        Helpers.setLoading(false);
      },
      err => {
        Helpers.setLoading(false);
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
    let sub: Subscription;
    console.log(this.currentItem);
    if (this.currentItem._id) {
      sub = this._service.putPosition(this.currentItem).subscribe(
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
      sub = this._service.postPosition(this.currentItem).subscribe(
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
    const sub = this._service.deletePosition(id).subscribe(rs => {
      if (rs["count"] !== 0) {
        this._toastr.success("Xóa thành công", undefined, { closeButton: true });
        this._service.loadData();
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
  }

  ngAfterViewInit() {
    this._script.loadScripts("app-position", ["assets/demo/default/custom/crud/forms/validation/form-controls.js"]);
  }
}
