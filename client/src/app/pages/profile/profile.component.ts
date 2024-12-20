import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageContentComponent } from '../../layouts/main-layout/components/page-content/page-content.component';
import { InputComponent } from '../../shared/components';
import { UserState } from '../../shared/states/user.state';
import { JsonPipe } from '@angular/common';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
	standalone: true,
	imports: [
		PageContentComponent,
		FormsModule,
		ReactiveFormsModule,
		InputComponent,

		JsonPipe
	],
})
export class ProfileComponent {
	constructor(
		public $user: UserState
	) { }

	ngOnInit(): void {
	}

}
