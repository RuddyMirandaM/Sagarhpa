import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FindGroupsRequestDTO, PaginationResponseDTO, QueryDataState, CreateUpdateGroupRequest } from '../dtos';
import { GroupItemResponse } from '../models';
import { HttpService } from './http.service';

@Injectable({
	providedIn: 'root',
})
export class GroupService {
	url: string = environment.api_url;

	constructor(private _http: HttpService) { }

	getGroups(data?: Partial<FindGroupsRequestDTO>): Promise<PaginationResponseDTO<GroupItemResponse>> {
		const state = data && new FindGroupsRequestDTO(data) || new QueryDataState({})
		return this._http.request('GET', `${this.url}/grupos`, { params: state.toPlain() })
	}

	createGroup(data: CreateUpdateGroupRequest): Promise<any> {
		return this._http.POST(`${this.url}/grupos`, data);
	}

	updateGroup(id: number, data: CreateUpdateGroupRequest): Promise<any> {
		return this._http.PATCH(`${this.url}/grupos/${id}/editar`, data);
	}

	activateGroup(id: number): Promise<any> {
		return this._http.PATCH(`${this.url}/grupos/${id}/activar`);
	}

	deactivateGroup(id: number): Promise<any> {
		return this._http.PATCH(`${this.url}/grupos/${id}/desactivar`);
	}

	delete(id: number): Promise<any> {
		return this._http.DELETE(`${this.url}/grupos/${id}/eliminar`);
	}
}
