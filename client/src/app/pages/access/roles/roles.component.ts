import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { take } from 'rxjs';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { NgClass, DatePipe } from '@angular/common';
import { PrimeTemplate } from 'primeng/api';
import { PaginationResponseDTO, QueryDataState } from '../../../core/dtos';
import { RolesItemResponse } from '../../../core/models';
import { RolesService } from '../../../core/services';
import { PageContentComponent } from '../../../layouts/main-layout/components';
import { PermissionControlDirective } from '../../../shared/directives';
import { cConfirm } from '../../../shared/functions';
import { AssignPermissionsFormComponent } from './assign-permissions-form/assign-permissions-form.component';
import { RoleFormComponent } from './role-form/role-form.component';
import { Permissions } from '../../../core/data';

@Component({
	templateUrl: './roles.component.html',
	standalone: true,
	providers: [DialogService],
	imports: [PageContentComponent, PermissionControlDirective, TableModule, PrimeTemplate, NgClass, DatePipe]
})
export class RolesComponent implements OnInit {
	gridData: PaginationResponseDTO<RolesItemResponse> = { data: [], total: 0 }
	state: QueryDataState = new QueryDataState({
		skip: 0,
		take: 15,
	});
	selectedItem?: RolesItemResponse
	permissions = Permissions;
	constructor(private _roles: RolesService, public dialogService: DialogService) {
	}
	ngOnInit(): void {
	}
	dataStateChange(state: TableLazyLoadEvent) {
		this.state.set(state)
		this.getList()
	}
	selectionChange(e: any) {
		this.selectedItem = e.selectedRows && e.selectedRows[0] && e.selectedRows[0].dataItem || undefined;
	}
	async getList() {
		this.selectedItem = undefined
		this.gridData = await this._roles.getRoles(this.state);
	}
	async remove() {
		const confirm = await cConfirm('¡Advertencia! Estás a punto de eliminar el rol. Esta acción no se podrá revertir.');
		const item = this.selectedItem
		if (!item) { return }
		if (confirm) {
			await this._roles.delete(item.id);
			this.getList();
		}
	}
	async toggleActive(active: boolean) {
		const title = active ? '¿Está seguro de activar este registro?' : '¿Está seguro de desactivar este registro?'
		const item = this.selectedItem
		if (!item) { return }
		const confirm = await cConfirm(title);

		if (confirm) {
			if (item.isActive) {
				await this._roles.deactivateRole(item.id);
			} else {
				item.isActive = !item.isActive;
				await this._roles.activateRole(item.id);
			}

			this.getList();
		}
	}
	async openForm(item?: RolesItemResponse) {
		// const item = this.selectedItem
		const ref = this.dialogService.open(RoleFormComponent, {
			width: '500px',
			data: {
				item
			}
		});
		ref.onClose.pipe(take(1)).subscribe(() => {
			this.getList();
		})
	}

	async openAssignForm() {
		const item = this.selectedItem
		if (!item) { return }

		const ref = this.dialogService.open(AssignPermissionsFormComponent, {
			width: '1000px',
			data: {
				role_id: item.id
			}
		});
	}
}
