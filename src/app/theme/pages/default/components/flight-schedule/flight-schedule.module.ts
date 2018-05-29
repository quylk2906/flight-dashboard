import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FlightScheduleComponent } from './flight-schedule.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default/default.component';

const routes: Routes = [
   {
      "path": "",
      "component": DefaultComponent,
      "children": [
         {
            "path": "",
            "component": FlightScheduleComponent
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
      FlightScheduleComponent
   ]
})
export class FlightScheduleModule { }