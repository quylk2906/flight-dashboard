import { NgModule } from "@angular/core";
import { ThemeComponent } from "./theme.component";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "../auth/_guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    component: ThemeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "index",
        loadChildren: "./pages/aside-left-display-disabled/index/index.module#IndexModule"
      },
      {
        path: "profile",
        loadChildren: "./pages/default/profile/profile.module#ProfileModule"
      },
      {
        path: "404-not-found",
        loadChildren: "./pages/default/not-found/not-found.module#NotFoundModule"
      },
      {
        path: "500-internal-server-error",
        loadChildren: "./pages/default/server-error/server-error.module#ServerErrorModule"
      },
      {
        path: "components/airport",
        loadChildren: "./pages/default/components/airport/airport.module#AirportModule"
      },
      {
        path: "components/airline",
        loadChildren: "./pages/default/components/airline/airline.module#AirlineModule"
      },
      {
        path: "components/client",
        loadChildren: "./pages/default/components/client/client.module#ClientModule"
      },
      {
        path: "components/client-ticket",
        loadChildren: "./pages/default/components/client-ticket/client-ticket.module#ClientTicketModule"
      },
      // {
      //    'path': 'components\/deposit',
      //    'loadChildren': '.\/pages\/default\/components\/deposit\/deposit.module#DepositModule'
      // },
      {
        path: "components/approve",
        loadChildren: "./pages/default/components/approve/approve.module#ApproveModule"
      },
      {
        path: "components/position",
        loadChildren: "./pages/default/components/position/position.module#PositionModule"
      },
      {
        path: "components/agency",
        loadChildren: "./pages/default/components/agency/agency.module#AgencyModule"
      },
      {
        path: "components/account",
        loadChildren: "./pages/default/components/account/account.module#AccountModule"
      },
      {
        path: "components/payment-detail",
        loadChildren: "./pages/default/components/payment-detail/payment-detail.module#PaymentDetailModule"
      },
      {
        path: "components/payment-detail/:id",
        loadChildren: "./pages/default/components/payment-detail/payment-detail.module#PaymentDetailModule"
      }
      // {
      //    'path': 'components\/payment',
      //    'loadChildren': '.\/pages\/default\/components\/payment\/payment.module#PaymentModule'
      // },
      // {
      //    'path': 'components\/plane',
      //    'loadChildren': '.\/pages\/default\/components\/plane\/plane.module#PlaneModule'
      // }
    ]
  },
  {
    path: "**",
    redirectTo: "404-not-found",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThemeRoutingModule {}
