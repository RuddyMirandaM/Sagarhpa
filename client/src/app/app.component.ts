import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from './shared/components';

@Component({
	selector: 'app-root',
	template: `
		<app-loading [listener]="true"></app-loading>
		<router-outlet></router-outlet>
	`,
	standalone: true,
	imports: [LoadingComponent, RouterOutlet]
})
export class AppComponent { }
