import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services';

export const isAuthenticatedGuard = async () => {
	const _router = inject(Router);
	const _auth = inject(AuthService);
	const isAuth = await _auth.llaveClient.isAuthenticated()
	if (isAuth) {
		_router.navigate(['/app'])
		return false;
	}
	return true;
};
