import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';

@Component({
  selector: 'app-ticket-price',
  templateUrl: './ticket-price.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TicketPriceComponent implements OnInit, AfterViewInit {
  constructor(private _script: ScriptLoaderService) { }
  ngOnInit() { }
  ngAfterViewInit() {
    this._script.loadScripts('app-ticket-price',
      [
        'assets/demo/default/custom/crud/forms/widgets/select2.js',
        'assets/vendors/custom/datatables/datatables.bundle.js',
        'assets/demo/default/custom/crud/datatables/basic/paginations.js',
        'assets/demo/default/custom/crud/forms/validation/form-controls.js'       
      ]);
  }
}
