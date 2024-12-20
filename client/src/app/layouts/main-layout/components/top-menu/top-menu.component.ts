import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService, UsersService } from '../../../../core/services';
import { AppState } from '../../../../shared/states/app.state';
import { UserState } from '../../../../shared/states/user.state';

@Component({
	selector: 'app-top-menu',
	templateUrl: './top-menu.component.html',
	styleUrls: ['./top-menu.component.scss'],
	standalone: true,
	imports: [
		RouterLink,
		FormsModule,
		AsyncPipe,
		TitleCasePipe,
	],
})
export class TopMenuComponent{
	constructor(private _auth: AuthService, private _usr: UsersService, public $app: AppState, public $user: UserState) { }

	logout() {
		this._auth.logOut();
	}
}
