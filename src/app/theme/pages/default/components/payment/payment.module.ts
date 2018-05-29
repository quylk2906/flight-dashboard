import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PaymentComponent } from './payment.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default/default.component';

const routes: Routes = [
   {
      "path": "",
      "component": DefaultComponent,
      "children": [
         {
            "path": "",
            "component": PaymentComponent
         }
      ]
   }
];
@NgModule({
   imports: [
      CommonModule, RouterModule.forChild(routes), LayoutModule
   ], exports: [
      RouterModule
   ], declarations: [
      PaymentComponent
   ]
})
export class PaymentModule { }