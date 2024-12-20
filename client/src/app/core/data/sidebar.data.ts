import { SideBarModel } from '../models';
import { Permissions } from './roles-permissions.enum';

export const sideBarData: SideBarModel = {
	groups: [


		{
			text: 'Navegación',
			items: [
				{
					text: 'Dashboard',
					route: '/app/dashboard',
					icon: 'mdi mdi-view-dashboard',
				},
			],

		},
		{
			text: 'Administración',
			items: [

				{
					text: 'Acceso',
					icon: 'mdi mdi-account-group',
					permissions: [
						Permissions.AccessUsersModule,
						Permissions.AccessRolesModule,
						Permissions.AccessPermissionsModule,
						Permissions.AccessGroupsModule,
					],
					items: [
						{
							text: 'Usuarios',
							route: '/app/accesos/usuarios',
							permissions: [Permissions.AccessUsersModule],
						},
						{
							text: 'Roles',
							route: '/app/accesos/roles',
							permissions: [Permissions.AccessRolesModule],
						},
						{
							text: 'Permisos',
							route: '/app/accesos/permisos',
							permissions: [Permissions.AccessPermissionsModule],
						},
						{
							text: 'Grupos',
							route: '/app/accesos/grupos',
							permissions: [Permissions.AccessGroupsModule],
						},
					],
				},
			],
		},
		{
			text: 'Ganaderia',
			items: [

				{
					text: 'Titulos',
					icon: 'mdi mdi-account-group',
					route: '/app/titulos/titulos',
					permissions: [
						Permissions.AccessUsersModule,
						Permissions.AccessRolesModule,
						Permissions.AccessPermissionsModule,
						Permissions.AccessGroupsModule,
					],
					items: [
						{
							text: 'Expediciones',
							route: '/app/',
							permissions: [Permissions.AccessUsersModule],
							items:[							{
								text: 'En revisión',
								route: '/app/titulos/',
								permissions: [Permissions.AccessRolesModule],
							},
							{
								text: 'Autorizadas',
								route: '/app/accesos/permisos',
								permissions: [Permissions.AccessPermissionsModule],
							},
							{
								text: 'Revalidaciónes',
								route: '/app/accesos/grupos',
								permissions: [Permissions.AccessGroupsModule],
							},
						]




						},

						{
							text: 'Censo gaadero',
							route: '/app/accesos/grupos',
							permissions: [Permissions.AccessGroupsModule],
						},
					],
				},
			],
		},
		{
			text: 'Cerrar Sesión',
			items: [
				{
					text: 'Salir del Sistema',
					icon: 'fa fa-sign-out-alt',
					onClick: 'logout',
				},
			],
		},
	],
};
