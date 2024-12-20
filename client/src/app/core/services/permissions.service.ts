import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CreateUpdatePermissionRequest } from '../dtos';
import { PaginationResponseDTO, QueryDataState } from '../dtos/pagination.dto';
import { PermissionItemResponse } from '../models';
import { HttpService } from './http.service';

@Injectable({
	providedIn: 'root',
})
export class PermissionsService {
	url: string = environment.api_url;

	constructor(private _http: HttpService) { }

	getPermissions(data?: QueryDataState): Promise<PaginationResponseDTO<PermissionItemResponse>> {
		data = data || new QueryDataState({})
		return this._http.request('GET', `${this.url}/permisos`, { params: data.toPlain() })
	}

	createPermission(data: CreateUpdatePermissionRequest): Promise<any> {
		return this._http.POST(`${this.url}/permisos`, data);
	}

	updatePermission(
		key: string,
		data: CreateUpdatePermissionRequest
	): Promise<any> {
		return this._http.PATCH(`${this.url}/permisos/${key}/editar`, data);
	}

	activatePermission(key: string): Promise<any> {
		return this._http.PATCH(`${this.url}/permisos/${key}/activar`);
	}

	deactivatePermission(key: string): Promise<any> {
		return this._http.PATCH(`${this.url}/permisos/${key}/desactivar`);
	}
}
