import { enableProdMode } from "@angular/core";
import { environment } from "./environments/environment";
export { AppServerModule } from "./app/app.server.module";

if (environment.production) {
  enableProdMode();
}
