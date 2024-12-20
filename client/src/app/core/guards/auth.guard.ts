import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService, SessionCountdownService } from '../services';

export const authGuard: CanActivateFn = async () => {
	const _auth = inject(AuthService);
	const _scd = inject(SessionCountdownService);

	const active = _scd.sessionActive();
	if (!active) {
		return closeSession(_auth);
	}

	const r = await _auth.verificarUsuario();
	if (!r) {
		return closeSession(_auth);
	}

	return true;
};

function closeSession(_auth: AuthService) {
	_auth.logOut();
	return false;
}
