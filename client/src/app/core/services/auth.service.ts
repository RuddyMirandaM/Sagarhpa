import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { IsNoE } from '../../shared/functions';
import { AppState } from '../../shared/states/app.state';
import { AuthenticationResponse } from '../dtos';
import { AppStorageService, HttpService } from '../services';

export const url_refresh_token: string = `${environment.api_url}/auth/refresh`;

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	url = environment.api_url;
	llaveClient!: ILlaveClient
	constructor(private _http: HttpService, private router: Router, private $app: AppState) {
	}

	initLlaveClient() {
		this.llaveClient = new (window as any).LlaveAuth(
			{
				clientId: environment.llave_client_id,
				redirectUrl: environment.llave_redirect_url,
				testingMode: !environment.production
			}
		)
		return this.llaveClient.createClient()
	}

	login() {
		const idToken = this.llaveClient.storage.idToken
		return this._http.POST(`${this.url}/auth/login`, {
			id_token: idToken
		}) as Promise<AuthenticationResponse>;
	}

	async logOut() {
		this.$app.showLoading()
		const token = this.llaveClient.storage.accessToken
		if (!IsNoE(token)) {
			this._http.request('POST', `${this.url}/auth/logout`, {
				headers: {
					Authorization: 'Bearer ' + token,
				},
				skipInterceptor: true
			})
				.catch(() => { })
				// .finally(() => {
				// 	this._loader.show()
				// })
		}
		AppStorageService.clearAll();
		this.llaveClient.logOut();
		setTimeout(() => {
			this.$app.hideLoading()
			this.router.navigate(['/login'])
		}, 1000);
	}

	async verificarUsuario(): Promise<boolean> {
		const token = this.llaveClient.storage.accessToken
		if (IsNoE(token)) {
			return Promise.resolve(false);
		}
		try {
			await this._http.GET(`${this.url}/auth/verify`)
			return true;
		} catch (error) {
			return false;
		}
	}
}

interface ILlaveClient {
	storage: {
		idToken: string
		accessToken: string
		userData: string
	}
	createClient(): Promise<void>
	loginWithRedirect(): Promise<void>
	getToken(code?: string): Promise<void>
	getUserInfo(): Promise<any>
	renewRefreshToken(): Promise<void>
	isAuthenticated(): Promise<boolean>
	logOut(): void
}
