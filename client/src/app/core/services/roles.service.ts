import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { QueryDataState, PaginationResponseDTO, CreateUpdateRoleRequest, AddRemoveRolePermissionRequest } from '../dtos';
import { RolesItemResponse } from '../models';
import { HttpService } from './http.service';

@Injectable({
	providedIn: 'root',
})
export class RolesService {
	url: string = environment.api_url;

	constructor(private _http: HttpService) { }

	getRoles(data?: QueryDataState): Promise<PaginationResponseDTO<RolesItemResponse>> {
		data = data || new QueryDataState({})
		// return this._http.GET(`${this.url}/usuarios`);
		return this._http.request('GET', `${this.url}/roles`, { params: data.toPlain() })
	}
	getById(id: number): Promise<RolesItemResponse> {
		return this._http.request('GET', `${this.url}/roles/${id}`)
	}
	createRole(data: CreateUpdateRoleRequest): Promise<any> {
		return this._http.POST(`${this.url}/roles`, data);
	}

	updateRole(id: number, data: CreateUpdateRoleRequest): Promise<any> {
		return this._http.PATCH(`${this.url}/roles/${id}/editar`, data);
	}

	activateRole(id: number): Promise<any> {
		return this._http.request('PATCH', `${this.url}/roles/${id}/activar`);
	}
	deactivateRole(id: number): Promise<any> {
		return this._http.request('PATCH', `${this.url}/roles/${id}/desactivar`);
	}
	delete(id: number): Promise<any> {
		return this._http.request('DELETE', `${this.url}/roles/${id}/eliminar`);
	}

	renovateRolePermissions(
		id: number,
		data: AddRemoveRolePermissionRequest
	): Promise<any> {
		return this._http.POST(`${this.url}/roles/${id}/permisos`, data);
	}
}
