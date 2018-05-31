import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TicketPriceComponent } from './ticket-price.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default/default.component';
import { TicketPriceService } from '../../../../../_services/ticket-price.service';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        "path": "",
        "component": TicketPriceComponent
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(routes), LayoutModule, FormsModule
  ], exports: [
    RouterModule
  ],
  providers: [
    TicketPriceService
  ],
  declarations: [
    TicketPriceComponent
  ]
})
export class TicketPriceModule { }
