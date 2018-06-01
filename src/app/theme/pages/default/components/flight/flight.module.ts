import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FlightComponent } from './flight.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default/default.component';
import { FlightService } from '../../../../../_services/flight.service';
import { FormsModule } from '@angular/forms';
import { AirlineAgentService } from '../../../../../_services/airline-agent.service';
import { AirportService } from '../../../../../_services/airport.service';

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
    FlightService, AirlineAgentService, AirportService
  ],
  declarations: [
    FlightComponent
  ]
})
export class FlightModule { }
FlightService