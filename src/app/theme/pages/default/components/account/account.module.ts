import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { AccountComponent } from "./account.component";
import { LayoutModule } from "../../../../layouts/layout.module";
import { DefaultComponent } from "../../../default/default.component";
import { FormsModule } from "@angular/forms";
import { AgencyService } from "../../../../../_services/agency.service";
import { DataTablesModule } from "angular-datatables";
import { AccountService } from "../../../../../_services/account.service";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: AccountComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LayoutModule,
    FormsModule,
    DataTablesModule
  ],
  exports: [RouterModule],
  providers: [AgencyService, AccountService],
  declarations: [AccountComponent]
})
export class AccountModule {}
