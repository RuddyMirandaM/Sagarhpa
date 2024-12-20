import { Component, OnInit } from '@angular/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { NgArrayPipesModule } from 'ngx-pipes';
import { NgClass } from '@angular/common';
import { PrimeTemplate } from 'primeng/api';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationResponseDTO, FindUsersRequestDTO } from '../../../core/dtos';
import { UserItemResponse } from '../../../core/models';
import { UsersService } from '../../../core/services';
import { PageContentComponent } from '../../../layouts/main-layout/components';
import { InputComponent } from '../../../shared/components';
import { cConfirm } from '../../../shared/functions';
import { LoadingComponent } from "../../../shared/components/loading/loading.component";

@Component({
	templateUrl: './users.component.html',
	standalone: true,
	imports: [PageContentComponent, InputComponent, FormsModule, RouterLink, TableModule, PrimeTemplate, NgClass, NgArrayPipesModule, LoadingComponent]
})
export class UsersComponent implements OnInit {
	gridData: PaginationResponseDTO<UserItemResponse> = { data: [], total: 0 }
	state: FindUsersRequestDTO = new FindUsersRequestDTO({
		skip: 0,
		take: 15,
	});
	selectedItem?: UserItemResponse
	permissions = Permissions;
	constructor(private _users: UsersService) {
	}
	ngOnInit(): void {
	}
	async getList() {
		this.selectedItem = undefined
		this.gridData = await this._users.getUsers(this.state);
	}
	public dataStateChange(state: TableLazyLoadEvent) {
		this.state.set(state)
		this.getList()
	}
	async toogleActive(active: boolean) {
		const title = active ? '¿Está seguro de activar este registro?' : '¿Está seguro de desactivar este registro?'
		const item = this.selectedItem
		if (!item) { return }
		const confirm = await cConfirm(title);
		if (confirm) {
			if (item.isActive) {
				await this._users.deleteUser(item.uuid);
			} else {
				item.isActive = !item.isActive;
				await this._users.activateUser(item.uuid);
			}
			this.getList();
		}
	}
	clearFilters() {
		this.state.clear()
	}
}
