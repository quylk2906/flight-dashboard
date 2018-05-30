import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';

@Component({
  selector: 'app-flight-schedule',
  templateUrl: './flight-schedule.component.html',
  encapsulation: ViewEncapsulation.None
})
export class FlightScheduleComponent implements OnInit, AfterViewInit {
  constructor(private _script: ScriptLoaderService) { }
  ngOnInit() { }
  ngAfterViewInit() {
    this._script.loadScripts('app-flight-schedule',
      [
        'assets/vendors/custom/datatables/datatables.bundle.js',
        'assets/demo/default/custom/crud/forms/widgets/select2.js',
        'assets/demo/default/custom/crud/datatables/basic/paginations.js',
        'assets/demo/default/custom/crud/forms/validation/form-controls.js',
        'assets/demo/default/custom/crud/forms/widgets/bootstrap-datetimepicker.js'
      ]);
  }
}
