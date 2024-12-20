import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localeEsMx from '@angular/common/locales/es-MX';
import { APP_INITIALIZER, ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { routes } from './app.routes';
import { AuthService } from './core/services';
import { errorInterceptor, requestInterceptor } from './core/interceptors';

registerLocaleData(localeEsMx, 'es-Mx');

export const appConfig: ApplicationConfig = {
	providers: [
		{
			provide: APP_INITIALIZER,
			useFactory: (_auth: AuthService) => () => _auth.initLlaveClient(),
			deps: [AuthService],
			multi: true,
		},
		{ provide: LOCALE_ID, useValue: "es-Mx" },
		// DialogService, // todo: quitarlo de aqui
		provideRouter(routes),
		provideHttpClient(
			withInterceptors([requestInterceptor, errorInterceptor])
		),
		provideAnimations()
	]
}
