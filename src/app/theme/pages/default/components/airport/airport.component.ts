import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';

@Component({
  selector: 'app-airport',
  templateUrl: './airport.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AirportComponent implements OnInit, AfterViewInit {

  constructor(private _script: ScriptLoaderService) { }
  ngOnInit() { }

  ngAfterViewInit() {
    this._script.loadScripts('app-airport',
      [
        'assets/vendors/custom/datatables/datatables.bundle.js',
        'assets/demo/default/custom/crud/datatables/basic/paginations.js',
        'assets/demo/default/custom/crud/forms/validation/form-controls.js'
      ]);
  }
}
