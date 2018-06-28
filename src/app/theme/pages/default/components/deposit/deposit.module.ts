import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DepositComponent } from './deposit.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default/default.component';
import { FormsModule } from '@angular/forms';
import { DepositService } from '../../../../../_services/deposit.service';
import { AgencyService } from '../../../../../_services/agency.service';
import { DataTablesModule } from 'angular-datatables';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        "path": "",
        "component": DepositComponent
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
    DepositService,
    AgencyService
  ], 
  declarations: [
    DepositComponent
  ]
})
export class DepositModule { }
