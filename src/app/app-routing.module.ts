import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LogoutComponent } from "./auth/logout/logout.component";

const routes: Routes = [
{path: 'login', loadChildren: './auth/auth.module#AuthModule'},
{path: 'logout', component: LogoutComponent},
	{path: '', redirectTo: 'index', pathMatch: 'full'},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
	exports: [RouterModule]
})
export class AppRoutingModule { }