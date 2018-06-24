import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default/default.component';


import { ClientComponent } from './client.component';
import { FormsModule } from '@angular/forms';


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
    CommonModule, RouterModule.forChild(routes), LayoutModule, FormsModule
  ], exports: [
    RouterModule
  ],
  providers: [
  ],
  declarations: [
    ClientComponent
  ]
})
export class ClientModule { }
