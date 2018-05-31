import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FlightScheduleComponent } from './flight-schedule.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default/default.component';
import { FlightScheduleService } from '../../../../../_services/flight-schedule.service';
import { FormsModule } from '@angular/forms';



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
    CommonModule, RouterModule.forChild(routes), LayoutModule, FormsModule
  ], exports: [
    RouterModule
  ],
  providers: [
    FlightScheduleService
  ],
  declarations: [
    FlightScheduleComponent
  ]
})
export class FlightScheduleModule { }
