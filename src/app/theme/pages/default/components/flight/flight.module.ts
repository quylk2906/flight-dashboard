import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FlightComponent } from './flight.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default/default.component';
import { FlightService } from '../../../../../_services/flight.service';
import { FormsModule } from '@angular/forms';
import { AirportService } from '../../../../../_services/airport.service';
import { formatDatePipe } from './flight.pipe';
const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        "path": "",
        "component": FlightComponent
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
    FlightService, AirportService
  ],
  declarations: [
    FlightComponent,
    formatDatePipe
  ]
})
export class FlightModule { }
FlightService