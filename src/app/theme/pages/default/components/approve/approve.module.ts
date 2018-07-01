import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default/default.component';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { ClientTicketService } from '../../../../../_services/client-ticket.service';
import { ApproveComponent } from './approve.component';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        "path": "",
        "component": ApproveComponent
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(routes), LayoutModule, FormsModule,
    DataTablesModule
  ], exports: [
    RouterModule
  ],
  providers: [
    ClientTicketService
  ], 
  declarations: [
    ApproveComponent
  ]
})
export class ApproveModule { }
