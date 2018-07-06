import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PaymentDetailComponent } from './payment-detail.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default/default.component';
import { FormsModule } from '@angular/forms';
import { PaymentDetailService } from '../../../../../_services/payment-detail.service';
import { DataTablesModule } from 'angular-datatables';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        "path": "",
        "component": PaymentDetailComponent
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
    PaymentDetailService
  ],
  declarations: [
    PaymentDetailComponent
  ]
})
export class PaymentDetailModule { }
