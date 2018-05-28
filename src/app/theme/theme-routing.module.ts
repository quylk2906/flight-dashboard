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
        'path': 'index',
        'loadChildren': '.\/pages\/default\/blank\/blank.module#BlankModule',
      },
      {
        "path": "components\/base\/typography",
        "loadChildren": ".\/pages\/default\/components\/base\/base-typography\/base-typography.module#BaseTypographyModule"
      },
      {
        "path": "components\/base\/state",
        "loadChildren": ".\/pages\/default\/components\/base\/base-state\/base-state.module#BaseStateModule"
      },
      {
        "path": "components\/base\/stack",
        "loadChildren": ".\/pages\/default\/components\/base\/base-stack\/base-stack.module#BaseStackModule"
      },
      {
        "path": "components\/base\/tables",
        "loadChildren": ".\/pages\/default\/components\/base\/base-tables\/base-tables.module#BaseTablesModule"
      },
      {
        "path": "crud\/forms\/widgets\/bootstrap-datepicker",
        "loadChildren": ".\/pages\/default\/crud\/forms\/widgets\/widgets-bootstrap-datepicker\/widgets-bootstrap-datepicker.module#WidgetsBootstrapDatepickerModule"
      },
      {
        "path": "crud\/forms\/widgets\/bootstrap-datetimepicker",
        "loadChildren": ".\/pages\/default\/crud\/forms\/widgets\/widgets-bootstrap-datetimepicker\/widgets-bootstrap-datetimepicker.module#WidgetsBootstrapDatetimepickerModule"
      },
      {
        "path": "crud\/forms\/widgets\/bootstrap-timepicker",
        "loadChildren": ".\/pages\/default\/crud\/forms\/widgets\/widgets-bootstrap-timepicker\/widgets-bootstrap-timepicker.module#WidgetsBootstrapTimepickerModule"
      },
      {
        "path": "crud\/forms\/widgets\/bootstrap-daterangepicker",
        "loadChildren": ".\/pages\/default\/crud\/forms\/widgets\/widgets-bootstrap-daterangepicker\/widgets-bootstrap-daterangepicker.module#WidgetsBootstrapDaterangepickerModule"
      },
      {
        "path": "crud\/forms\/widgets\/bootstrap-select",
        "loadChildren": ".\/pages\/default\/crud\/forms\/widgets\/widgets-bootstrap-select\/widgets-bootstrap-select.module#WidgetsBootstrapSelectModule"
      },
      {
        "path": "crud\/forms\/widgets\/select2",
        "loadChildren": ".\/pages\/default\/crud\/forms\/widgets\/widgets-select2\/widgets-select2.module#WidgetsSelect2Module"
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
