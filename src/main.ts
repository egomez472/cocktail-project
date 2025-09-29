import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from '@app/app';
import { appConfig } from '@app/app.config';

bootstrapApplication(AppComponent, appConfig).catch((err: unknown) =>
  // eslint-disable-next-line no-console
  console.error(err)
);
