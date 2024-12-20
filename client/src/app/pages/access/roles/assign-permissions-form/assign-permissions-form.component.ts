import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CreateUpdateRoleRequest } from '../../../../core/dtos';
import { RolesItemResponse, GroupItemResponse, PermissionItemResponse } from '../../../../core/models';
import { RolesService, GroupService } from '../../../../core/services';
import { ModalContentComponent } from '../../../../shared/components';

declare const $: any;

@Component({
	selector: 'app-assign-permissions-form',
	templateUrl: './assign-permissions-form.component.html',
	standalone: true,
	imports: [FormsModule, ModalContentComponent],
})
export class AssignPermissionsFormComponent implements OnInit {
	role_id!: number
	item?: RolesItemResponse;

	@ViewChild(ModalContentComponent) modal!: ModalContentComponent;

	isLoading: boolean = true;
	title: string = 'Administrar permisos al rol';
	catGroups: GroupItemResponse[] = [];
	userPermissions: PermissionItemResponse[] = [];
	userPermissionsKeys: string[] = [];

	frm: CreateUpdateRoleRequest = {};

	constructor(private _roles: RolesService, private _groups: GroupService, private _dialogService: DynamicDialogConfig) { }

	ngOnInit(): void {
		this.role_id = this._dialogService.data.role_id;
		this.init();
	}

	async init() {
		await this.getRole()
		await this.getCatGroups();
		this.title = `Administrar permisos al rol ${this.item?.name}`;
	}

	async save() {
		try {
			await this._roles.renovateRolePermissions(this.item!.id, {
				roleId: this.item!.id,
				permissionKeys: this.userPermissionsKeys,
			});
		} catch (error) { }
		this.modal.close();
	}

	async getRole() {
		this.item = await this._roles.getById(this.role_id);
	}
	async getCatGroups() {
		const { data: groups } = await this._groups.getGroups({ permissions: true, active: true });

		const permissionRole = this.item?.permissions;
		const permisisionRoleKeys = permissionRole?.map(
			(permissionRole) => permissionRole.key
		);
		groups.map(({ permissions }) => {
			permissions && permissions.forEach((permission) => {
				const permissionChecked = permisisionRoleKeys?.includes(permission.key);
				if (permissionChecked) {
					this.userPermissionsKeys.push(permission.key);
					permission.checked = permissionChecked;
				}
			});
		});

		this.catGroups = groups;
	}

	setRolePermissionList(event: any, permissionKey: string) {
		const permissionChecked = event.target.checked;

		if (permissionChecked) {
			this.userPermissionsKeys.push(permissionKey);
		} else if (this.userPermissionsKeys.length) {
			this.userPermissionsKeys = this.userPermissionsKeys.filter(
				(permission) => permission !== permissionKey
			);
		}
	}

	selectAllPermissions(all: boolean) {
		const allGroups = this.catGroups;

		const catData = [...allGroups];

		catData.map(({ permissions }) => {
			if (permissions) {
				permissions.forEach((permission) => {
					permission.checked = all;
				});
			}
		});

		if (all) {
			const groups = allGroups.map((group) => group.permissions);
			const permissionsKeys: string[] = [];

			groups.forEach((permissions) => {
				const permissionArr = permissions?.map((permission) => permission.key);
				permissionArr?.forEach((id) => permissionsKeys.push(id));
			});

			this.userPermissionsKeys = permissionsKeys;
		} else {
			this.userPermissionsKeys = [];
		}
	}
}
