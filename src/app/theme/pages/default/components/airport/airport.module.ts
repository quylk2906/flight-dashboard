import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AirportComponent } from './airport.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default/default.component';

const routes: Routes = [
   {
      "path": "",
      "component": DefaultComponent,
      "children": [
         {
            "path": "",
            "component": AirportComponent
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
      AirportComponent
   ]
})
export class AirportModule { }