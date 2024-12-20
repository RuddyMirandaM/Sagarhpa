import { Component, OnInit } from '@angular/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { take } from 'rxjs';
import { NgClass, DatePipe } from '@angular/common';
import { PrimeTemplate } from 'primeng/api';
import { PaginationResponseDTO, QueryDataState } from '../../../core/dtos';
import { PermissionItemResponse } from '../../../core/models';
import { PermissionsService } from '../../../core/services';
import { PageContentComponent } from '../../../layouts/main-layout/components';
import { cConfirm } from '../../../shared/functions';
import { PermissionFormComponent } from './permission-form/permission-form.component';

@Component({
	selector: 'app-permissions',
	templateUrl: './permissions.component.html',
	styleUrls: ['./permissions.component.scss'],
	standalone: true,
	imports: [
		PageContentComponent,
		TableModule,
		PrimeTemplate,
		NgClass,
		DatePipe,
	],
	providers: [DialogService],
})
export class PermissionsComponent implements OnInit {
	gridData: PaginationResponseDTO<PermissionItemResponse> = { data: [], total: 0 }
	state: QueryDataState = new QueryDataState({
		skip: 0,
		take: 15,
	});
	selectedItem?: PermissionItemResponse
	permissions = Permissions;


	constructor(
		private _permissions: PermissionsService,
		public dialogService: DialogService
	) { }
	ngOnInit(): void {
	}
	dataStateChange(state: TableLazyLoadEvent) {
		this.state.set(state)
		this.getList()
	}

	async getList() {
		this.selectedItem = undefined
		this.gridData = await this._permissions.getPermissions(this.state);
	}
	async toggleActive(active: boolean) {
		const title = active ? '¿Está seguro de activar este registro?' : '¿Está seguro de desactivar este registro?'
		const item = this.selectedItem
		if (!item) { return }
		const confirm = await cConfirm(title);

		if (confirm) {
			if (item.isActive) {
				await this._permissions.deactivatePermission(item.key);
			} else {
				item.isActive = !item.isActive;
				await this._permissions.activatePermission(item.key);
			}
			this.getList();
		}
	}

	async openForm() {
		const item = this.selectedItem
		if (!item) { return }
		const ref = this.dialogService.open(PermissionFormComponent, {
			width: '500px',
			data: {
				item
			}
		});
		ref.onClose.pipe(take(1)).subscribe(() => {
			this.getList();
		})
	}

}
