import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default/default.component';
import { FormsModule } from '@angular/forms';
import { PositionComponent } from './position.component';
import { PositionService } from '../../../../../_services/position.service';

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        "path": "",
        "component": PositionComponent
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(routes), LayoutModule, FormsModule
  ],
  exports: [
    RouterModule
  ],
  providers: [
    PositionService
  ],
  declarations: [
    PositionComponent
  ]
})
export class PositionModule { }
