import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { sideBarData } from '../../../../core/data';
import { SideBarItem } from '../../../../core/models';

@Component({
	selector: 'app-breadcrumb',
	templateUrl: './breadcrumb.component.html',
	styleUrls: ['./breadcrumb.component.scss'],
	standalone: true,
	imports: [RouterLink]
})
export class BreadcrumbComponent {
	currentRoute
	listRoutes: SideBarItem[] = []
	constructor(private router: Router) {
		this.currentRoute = this.router.url;
		this.listRoutes = this.find(sideBarData.groups)

	}
	find(items: any[], history: any[] = [], ops = { found: false }) {
		items.forEach((obj) => {
			if (ops.found) {
				return
			}
			let r = obj.route && obj.route === this.currentRoute && obj
			if (r) {
				ops.found = true
				history.push(r);
			} else if (!!obj.items && !!obj.items[0]) {
				this.find(obj.items, history, ops)
				if (ops.found) {
					history.push(obj)
				}
			}
		})
		return Object.assign([], history).reverse();
	}
}
