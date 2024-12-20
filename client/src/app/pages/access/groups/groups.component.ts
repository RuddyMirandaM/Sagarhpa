import { DatePipe, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PrimeTemplate } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { take } from 'rxjs';
import { PaginationResponseDTO, QueryDataState } from '../../../core/dtos';
import { GroupItemResponse } from '../../../core/models';
import { GroupService } from '../../../core/services';
import { PageContentComponent } from '../../../layouts/main-layout/components';
import { cConfirm } from '../../../shared/functions';
import { GroupFormComponent } from './group-form/group-form.component';

@Component({
	selector: 'app-groups',
	templateUrl: './groups.component.html',
	styleUrls: ['./groups.component.scss'],
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
export class GroupsComponent implements OnInit {
	gridData: PaginationResponseDTO<GroupItemResponse> = { data: [], total: 0 }
	state: QueryDataState = new QueryDataState({
		skip: 0,
		take: 10,
	});
	selectedItem?: GroupItemResponse
	permissions = Permissions;
	constructor(private _groups: GroupService, public dialogService: DialogService) { }

	ngOnInit(): void {
	}
	dataStateChange(state: TableLazyLoadEvent) {
		this.state.set(state)
		this.getList()
	}

	async getList() {
		this.selectedItem = undefined
		this.gridData = await this._groups.getGroups(this.state);
	}

	async confirmModal(title: string) {
		const item = this.selectedItem
		if (!item) { return }
		const confirm = await cConfirm(title);

		if (confirm) {
			if (item.isActive) {
				await this._groups.deactivateGroup(item.id);
			} else {
				item.isActive = !item.isActive;
				await this._groups.activateGroup(item.id);
			}
			await this.getList();
		}
	}

	async openForm(item?: GroupItemResponse) {

		const ref = this.dialogService.open(GroupFormComponent, {
			width: '500px',
			data: {
				item
			}
		});
		ref.onClose.pipe(take(1)).subscribe(() => {
			this.getList();
		})
	}
	async remove() {
		const confirm = await cConfirm('¡Advertencia! Estás a punto de eliminar el grupo. Esta acción no se podrá revertir.');
		const item = this.selectedItem
		if (!item) { return }
		if (confirm) {
			await this._groups.delete(item.id);
			this.getList()
		}
	}
}
