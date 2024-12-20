import { Routes } from '@angular/router';
import { UserFormComponent } from './users/user-form/user-form.component';
import { GroupsComponent } from './groups/groups.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { RolesComponent } from './roles/roles.component';
import { UsersComponent } from './users/users.component';
import { Permissions } from '../../core/data';
import { RevisionComponent } from '../title/revision/revision.component';
import { TitulosComponent } from '../title/titulos/titulos.component';

export const accessRoutes: Routes = [

	{
		path: 'usuarios',
		data: { permissions: [Permissions.AccessUsersModule] },
		children: [
			{
				path: '',
				component: UsersComponent,
			},
			{
				path: 'crear',
				component: UserFormComponent,
			},
			{
				path: 'editar/:id',
				component: UserFormComponent,
			},
		]
	},
	{
		path: 'roles',
		component: RolesComponent,
		data: { permissions: [Permissions.AccessRolesModule] },
	},
	{
		path: 'permisos',
		component: PermissionsComponent,
		data: { permissions: [Permissions.AccessPermissionsModule] },
	},
	{
		path: 'grupos',
		component: GroupsComponent,
		data: { permissions: [Permissions.AccessGroupsModule] },
	},
	{
		path: 'titulos',
		component: TitulosComponent,
		data: { permissions: [Permissions.AccessGroupsModule] },
	},

	{
		path: 'En revision',
		component: RevisionComponent,
		data: { permissions: [Permissions.AccessGroupsModule] },
	},
];
