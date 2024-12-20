import { Injectable } from '@angular/core';
import { AuthenticationResponse, UserAuthentication } from '../../core/dtos';
import { AppStorageService } from '../../core/services';
import { BaseStateService } from './base.state';

@Injectable({
	providedIn: 'root'
})
export class UserState extends BaseStateService<AuthenticationResponse> {
	constructor() {
		super({
			user: {} as UserAuthentication,
			roles: [],
			permissions: []
		});
		this.setState(AppStorageService.user() || this.initialState)
	}

	setUser(user: AuthenticationResponse) {
		AppStorageService.login = user
		this.setState(user)
	}

	get user() {
		return this.select('user')
	}

	get permissions() {
		return this.select('permissions')
	}

	get roles() {
		return this.select('roles')
	}
}

