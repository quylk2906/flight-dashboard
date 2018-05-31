import { Component, OnInit, AfterViewInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NgForm } from '@angular/forms';
import { TicketPriceService } from '../../../../../_services/ticket-price.service';
import { Subscription } from 'rxjs/Subscription';
import { TicketPrice } from '../../../../../_models/ticket-price.model';
import { trimObjectAfterSave } from '../../../../../_utils/trimObject';
import { find } from 'lodash';

@Component({
  selector: 'app-ticket-price',
  templateUrl: './ticket-price.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TicketPriceComponent implements OnInit, OnDestroy, AfterViewInit {
  private subs: Subscription
  public list: TicketPrice[]
  
  public currentItem: TicketPrice = {
    ticketPriceCode: undefined,
   airlineAgentId: undefined,
   ticketClassId: undefined,
   flightScheduleId: undefined,
   adultPrice: undefined,
   kidPrice: undefined,
   adultTax:undefined,
   kidTax: undefined,
   id: undefined,
   createdAt: undefined,
   updatedAt: undefined
  }

  constructor(private _script: ScriptLoaderService, private _service: TicketPriceService) {
  }


  ngOnInit() {
    this.subs = this._service.getTicketPrice().subscribe(rs => {
      this.list = rs as TicketPrice[]
      console.log(this.list);
    })
  }

  onSubmit(from: NgForm) {
    const agent = trimObjectAfterSave(from.value)
    if (this.currentItem.id) {
      this.subs = this._service.putTicketPrice(agent).subscribe(rs => {
        // you have to call api to reload datable without reload page
        window.location.reload()
      })
    } else {
      this.subs = this._service.postTicketPrice(agent).subscribe(rs => {
        this.list.push(rs as TicketPrice)
        // you have to call api to reload datable without reload page
        window.location.reload()
      })
    }
  }

  onDelete(id) {
    this.subs = this._service.deleteTicketPrice(id).subscribe(rs => {
      if (rs['count'] !== 0) {
        // you have to call api to reload datable without reload page
        window.location.reload()
      }
    })
  }

  onEdit(id) {
    this.currentItem = find(this.list, (item) => {
      return item.id == id
    })
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  ngAfterViewInit() {
    this._script.loadScripts('app-ticket-price',
      [
        'assets/vendors/custom/datatables/datatables.bundle.js',
        'assets/demo/default/custom/crud/forms/widgets/select2.js',
        'assets/demo/default/custom/crud/datatables/standard/paginations.js',
        'assets/demo/default/custom/crud/forms/validation/form-controls.js',
        'assets/demo/default/custom/crud/forms/widgets/bootstrap-datetimepicker.js'
      ]);
  }
}
