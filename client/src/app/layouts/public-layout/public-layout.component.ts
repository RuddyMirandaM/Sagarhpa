import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-public-layout',
	standalone: true,
	imports: [
		RouterOutlet
	],
	template: `
	<router-outlet></router-outlet>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLayoutComponent { }
