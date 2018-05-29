import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: []
})
export class PaymentComponent implements OnInit, AfterViewInit {
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
