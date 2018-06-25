import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default/default.component';

import { ClientComponent } from './client.component';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../../../../_services/client.service';
import { DataTablesModule } from 'angular-datatables';


const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        "path": "",
        "component": ClientComponent
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
    ClientService
  ],
  declarations: [
    ClientComponent
  ]
})
export class ClientModule { }
