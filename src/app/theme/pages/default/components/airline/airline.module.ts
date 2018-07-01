import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default/default.component';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { AirlineComponent } from './airline.component';
import { AirlineService } from '../../../../../_services/airline.service';
const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        "path": "",
        "component": AirlineComponent
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(routes), LayoutModule, FormsModule
    , DataTablesModule
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AirlineService
  ],
  declarations: [
    AirlineComponent
  ]
})
export class AirlineModule { }
