import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DepositProgressComponent } from './deposit-progress.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default/default.component';
import { FormsModule } from '@angular/forms';
import { Progresservice } from '../../../../../_services/deposit-progress.service';
import { AgencyService } from '../../../../../_services/agency.service';
import { DepositService } from '../../../../../_services/deposit.service';
import { AccountService } from '../../../../../_services/account.service';
import { DataTablesModule } from 'angular-datatables';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        "path": "",
        "component": DepositProgressComponent
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
    Progresservice,
    AgencyService
  ],
  declarations: [
    DepositProgressComponent
  ]
})
export class DepositProgressModule { }
