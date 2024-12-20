import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { AuthService } from '../../core/services';
import { PageTextsPipe } from '../../shared/pipes';
import { AppState } from '../../shared/states/app.state';
import { ContactInfoComponent } from './contact-info/contact-info.component';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [FormsModule, PageTextsPipe],
	providers: [DialogService],
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
	email: string = '';
	password: string = '';
	submitted = false;
	dialogService = inject(DialogService)
	constructor(private _auth: AuthService, public router: Router, private $app: AppState) { }

	ngOnInit(): void {
		this.$app.hideLoading()
	}
	loginLlave() {
		this._auth.llaveClient.loginWithRedirect()
	}
	openContactInfo() {
		this.dialogService.open(ContactInfoComponent, { header: 'Información de contacto', width: '500px' });
	}
}
