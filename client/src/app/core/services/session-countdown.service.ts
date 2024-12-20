import { computed, Injectable, signal } from '@angular/core';
import { IsNoE } from '../../shared/functions';
import { AppStorageService, AuthService } from '../services';
import { environment } from '../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class SessionCountdownService {
	private inactivityMin = signal(0);
	private maxInactivityMin = Number(environment.sessio_time_in_min) ?? 0;
	private intervalId: number | null = null;

	constructor(private _auth: AuthService) { }

	setTimer() {
		const token = this._auth.llaveClient.storage.accessToken;
		if (IsNoE(token) || this.maxInactivityMin <= 0) {
			return;
		}

		this.stopTimer();
		this.setLastActivity();
		this.inactivityMin.set(0);
		this.intervalId = window.setInterval(() => this.loop(), 60000);
	}

	setLastActivity() {
		AppStorageService.lastActivity(Date.now());
	}

	private loop() {
		this.inactivityMin.update(val => val + 1);
		if (this.inactivityMin() >= this.maxInactivityMin) {
			this.closeSession();
		}
	}

	private closeSession() {
		this._auth.logOut();
		this.stopTimer();
	}

	stopTimer() {
		if (this.intervalId !== null) {
			window.clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}

	sessionActive = computed(() => {
		if (this.maxInactivityMin <= 0) {
			return true
		}
		const lastActivity = AppStorageService.lastActivity();
		if (lastActivity) {
			const expirationTime = lastActivity + (this.maxInactivityMin * 60 * 1000);
			return Date.now() <= expirationTime;
		}
		return false;
	});
}
