import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";
import { Observable } from "rxjs";
// import { Observable } from "rxjs";

const debuggerOn = true;

const debug = (message: string) => {
  return this.tap(
    nextVal => {
      if (debuggerOn) {
        console.log(message, nextVal);
      }
    },
    error => {
      if (debuggerOn) {
        console.error(message, error);
      }
    },
    () => {
      if (debuggerOn) {
        console.error("Observable completed - ", message);
      }
    }
  );
};

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.log(err));
