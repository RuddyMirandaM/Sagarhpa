/// <reference types="@angular/localize" />

import { enableProdMode, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

if (environment.production) {
	enableProdMode();
}

bootstrapApplication(AppComponent, appConfig)
	.catch((err) => console.log(err));