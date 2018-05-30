import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AirlineAgentComponent } from './airline-agent.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default/default.component';
import { AirlineAgentService } from '../../../../../_services/airline-agent.service';
const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        "path": "",
        "component": AirlineAgentComponent
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(routes), LayoutModule,
    FormsModule
  ],
  exports: [
    RouterModule
  ],
  providers: [AirlineAgentService],
  declarations: [
    AirlineAgentComponent
  ]
})
export class AirlineAgentModule { }
