import { BrowserModule } from "@angular/platform-browser";
import { NgModule, Inject, PLATFORM_ID, APP_ID } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ThemeComponent } from "./theme/theme.component";
import { LayoutModule } from "./theme/layouts/layout.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ScriptLoaderService } from "./_services/script-loader.service";
import { ThemeRoutingModule } from "./theme/theme-routing.module";
import { AuthModule } from "./auth/auth.module";
import { LayoutComponent } from "../app/theme/layouts/layout/layout.component";
import { AsideLeftMinimizeDefaultEnabledComponent } from "../app/theme/pages/aside-left-minimize-default-enabled/aside-left-minimize-default-enabled.component";
import { DataTablesModule } from "angular-datatables";
import { ToastrModule } from "ngx-toastr";
import { AuthInterceptor } from "./auth/auth.interceptor";
import { isPlatformBrowser } from "@angular/common";

@NgModule({
  declarations: [AsideLeftMinimizeDefaultEnabledComponent, LayoutComponent, ThemeComponent, AppComponent],
  imports: [
    LayoutModule,
    BrowserModule.withServerTransition({ appId: "flight-universal-app" }),
    BrowserAnimationsModule,
    AppRoutingModule,
    ThemeRoutingModule,
    AuthModule,
    HttpClientModule,
    DataTablesModule,
    ToastrModule.forRoot() // ToastrModule added
  ],
  providers: [
    ScriptLoaderService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(@Inject(PLATFORM_ID) private platformId: Object, @Inject(APP_ID) private appId: string) {
    const platform = isPlatformBrowser(this.platformId) ? " in the browser" : " on the server";
    console.log(`Running ${platform} with AppId: ${this.appId}`);
  }
}
