import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ClientTicketComponent } from './client-ticket.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default/default.component';

import { ClientService } from '../../../../../_services/client.service';
import { DataTablesModule } from 'angular-datatables';
import { AirportService } from '../../../../../_services/airport.service';
import { FormsModule } from '@angular/forms';
import { ClientTicketService } from '../../../../../_services/client-ticket.service';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        "path": "",
        "component": ClientTicketComponent
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(routes), 
    LayoutModule, 
    FormsModule, 
    DataTablesModule
  ], exports: [
    RouterModule
  ],
  providers: [
    ClientService, AirportService, ClientTicketService
  ],
  declarations: [
    ClientTicketComponent
  ]
})
export class ClientTicketModule { }
