import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { cAlert, hasJsonStructure } from '../../shared/functions';
import { X_SKIP_INTERCEPTOR, AuthService, url_refresh_token, HttpService } from '../services';

export const errorInterceptor = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
	if (request.headers.get(X_SKIP_INTERCEPTOR) === 'true') {
		return next(request);
	}
	const _auth = inject(AuthService)
	const _http = inject(HttpClient)
	return next(request).pipe(
		catchError((httpErrorRes: HttpErrorResponse) => {
			if (httpErrorRes.status === 401 && request.url !== url_refresh_token) {
				return refreshToken(next, request, _auth, _http);
			}
			let message = (httpErrorRes.error && httpErrorRes.error.message) || httpErrorRes.message;

			if (
				httpErrorRes.error &&
				httpErrorRes.error.errors &&
				Object.prototype.toString.call(httpErrorRes.error.errors) ===
				'[object Object]'
			) {
				const array_errors = Object.keys(httpErrorRes.error.errors).map((k) =>
					Array.isArray(httpErrorRes.error.errors[k])
						? httpErrorRes.error.errors[k].join(', ')
						: httpErrorRes.error.errors[k]
				);
				if (array_errors.length > 0) {
					message = array_errors.join(', ');
				}
			} else if (
				httpErrorRes.error &&
				httpErrorRes.error.errors &&
				Object.prototype.toString.call(httpErrorRes.error.errors) ===
				'[object Array]'
			) {
				const array_errors = httpErrorRes.error.errors;
				if (array_errors.length > 0) {
					message = array_errors.join(', ');
				}
			} else if (httpErrorRes.error && typeof httpErrorRes.error === 'string') {
				message = httpErrorRes.error;
				const e = hasJsonStructure(httpErrorRes.error);
				if (e && e['message']) {
					message = e['message'];
				}
			}

			cAlert(message, { icon: 'error' });
			return throwError(() => httpErrorRes.error);
		}),
	)
}
const refreshToken = (next: HttpHandlerFn, request: HttpRequest<any>, _auth: AuthService, _http: HttpClient) => {
	return from(_auth.llaveClient.renewRefreshToken()).pipe(
		switchMap(() => {
			return _http.request(request)
		})
	);
};
