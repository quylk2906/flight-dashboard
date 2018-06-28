import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AgencyComponent } from './agency.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default/default.component';
import { FormsModule } from '@angular/forms';
import { AgencyService } from '../../../../../_services/agency.service';
import { DataTablesModule } from 'angular-datatables';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        "path": "",
        "component": AgencyComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(routes), LayoutModule, FormsModule, DataTablesModule
  ], exports: [
    RouterModule
  ],
  providers: [
    AgencyService
  ],
  declarations: [
    AgencyComponent
  ]
})
export class AgencyModule { }
