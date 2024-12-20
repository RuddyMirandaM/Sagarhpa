import { Routes } from '@angular/router';
import { authGuard, isAuthenticatedGuard, rolePermissionsChildGuard } from './core/guards';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { ErrorComponent } from './pages/error/error.component';

export const routes: Routes = [
	{
		path: '',
		component: PublicLayoutComponent,
		children: [
			{
				path: '',
				redirectTo: 'login',
				pathMatch: 'full',
			},
			{
				path: 'login',
				canActivate: [isAuthenticatedGuard],
				loadComponent: () =>
					import('./pages/login/login.component').then((c) => c.LoginComponent),
			},
			{
				path: 'auth-callback',
				loadComponent: () =>
					import('./pages/auth-callback/auth-callback.component').then((c) => c.AuthCallbackComponent),
			},
		]
	},
	{
		path: 'app',
		component: MainLayoutComponent,
		canActivate: [authGuard],
		canActivateChild: [rolePermissionsChildGuard],
		children: [
			{
				path: '',
				loadComponent: () =>
					import('./pages/dashboard/dashboard.component').then((c) => c.DashboardComponent),
			},
			{
				path: 'perfil',
				loadComponent: () =>
					import('./pages/profile/profile.component').then((c) => c.ProfileComponent),
			},
			{
				path: 'accesos',
				loadChildren: () =>
					import('./pages/access/access.routes').then((m) => m.accessRoutes),
			},
			{
				path: 'titulos',
				loadChildren: () =>
					import('./pages/access/access.routes').then((m) => m.accessRoutes),
			},
		]
	},
	{
		path: 'error/:code',
		component: ErrorComponent,
	},
	{
		path: '**',
		redirectTo: 'app',
		pathMatch: 'full',
	},
];
