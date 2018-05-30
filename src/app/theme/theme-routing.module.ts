import { NgModule } from '@angular/core';
import { ThemeComponent } from './theme.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/_guards/auth.guard';

const routes: Routes = [
   {
      'path': '',
      'component': ThemeComponent,
      'canActivate': [AuthGuard],
      'children': [
         {
            "path": "index",
            "loadChildren": ".\/pages\/aside-left-display-disabled\/index\/index.module#IndexModule"
         },
         {
            "path": "profile",
            "loadChildren": ".\/pages\/default\/profile\/profile.module#ProfileModule"
         },
         {
            'path': 'components\/airline-agent',
            'loadChildren': '.\/pages\/default\/components\/airline-agent\/airline-agent.module#AirlineAgentModule'
         },
         {
            'path': 'components\/airport',
            'loadChildren': '.\/pages\/default\/components\/airport\/airport.module#AirportModule'
         },
         {
            'path': 'components\/contact',
            "loadChildren": ".\/pages\/default\/profile\/profile.module#ProfileModule"
         },
         {
            'path': 'components\/flight',
            'loadChildren': '.\/pages\/default\/components\/flight\/flight.module#FlightModule'
         },
         {
            'path': 'components\/ticket-price',
            'loadChildren': '.\/pages\/default\/components\/ticket-price\/ticket-price.module#TicketPriceModule'
         },
         {
            'path': 'components\/flight-schedule',
            'loadChildren': '.\/pages\/default\/components\/flight-schedule\/flight-schedule.module#FlightScheduleModule'
         },
         {
            'path': 'components\/payment',
            'loadChildren': '.\/pages\/default\/components\/payment\/payment.module#PaymentModule'
         },
         {
            'path': 'components\/plane',
            'loadChildren': '.\/pages\/default\/components\/plane\/plane.module#PlaneModule'
         }
      ],
   },
   {
      'path': '**',
      'redirectTo': 'index',
      'pathMatch': 'full',
   },
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule],
})
export class ThemeRoutingModule { }
