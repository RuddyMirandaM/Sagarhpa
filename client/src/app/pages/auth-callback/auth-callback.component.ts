import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services';
import { UserState } from '../../shared/states/user.state';

@Component({
	standalone: true,
	template: ``,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthCallbackComponent implements OnInit {

	code?: string | null

	constructor(private route: ActivatedRoute, private _auth: AuthService, private router: Router, private $user: UserState) {
	}
	async ngOnInit() {
		this.route.queryParams.subscribe((params) => {
			this.code = params.code;
			this.signin()
		})
	}
	async exchangeCode() {
		return this._auth.llaveClient.getToken()
	}
	async signin() {
		try {
			await this.exchangeCode()
			const loginRes = await this._auth.login()
			this.$user.setUser(loginRes)
			this.router.navigate(['/app']);
		} catch (error) {
			console.error(error);
			this._auth.llaveClient.logOut()
			this.router.navigate(['/login']);
		}
	}
}
