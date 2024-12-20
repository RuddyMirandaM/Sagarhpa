import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AppState } from '../../shared/states/app.state';
import { AuthService, SessionCountdownService, X_SKIP_INTERCEPTOR } from '../services';


export const requestInterceptor = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
	if (request.headers.get(X_SKIP_INTERCEPTOR) === 'true') {
		return next(request);
	}
	const $app = inject(AppState)
	const _scd = inject(SessionCountdownService)

	request = setToken(request);

	$app.showLoading()
	_scd.setTimer()
	return next(request).pipe(
		finalize(() => {
			$app.hideLoading()
		})
	)
}

const setToken = (request: HttpRequest<any>) => {
	const _auth = inject(AuthService)
	const t = _auth.llaveClient.storage.accessToken;
	return request.clone({
		headers: request.headers
			.set('Authorization', 'Bearer ' + t),
	});
}
