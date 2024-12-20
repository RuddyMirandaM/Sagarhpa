import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FindUsersRequestDTO, PaginationResponseDTO, CreateUpdateUserRequest, UpdateUserProfileRequest } from '../dtos';
import { UserItemResponse } from '../models';
import { HttpService } from '../services';

@Injectable({
	providedIn: 'root',
})
export class UsersService {
	url = environment.api_url;
	constructor(private _http: HttpService) { }

	getUsers(data: FindUsersRequestDTO): Promise<PaginationResponseDTO<UserItemResponse>> {
		return this._http.request('GET', `${this.url}/usuarios`, { params: data.toPlain() })
	}

	getUser(id: string): Promise<UserItemResponse> {
		return this._http.GET(`${this.url}/usuarios/${id}`);
	}

	createUser(data: CreateUpdateUserRequest): Promise<any> {
		return this._http.POST(`${this.url}/usuarios`, data);
	}

	updateUser(uuid: string, data: CreateUpdateUserRequest): Promise<any> {
		return this._http.PATCH(`${this.url}/usuarios/${uuid}/editar`, data);
	}

	activateUser(uuid: string): Promise<any> {
		return this._http.PATCH(`${this.url}/usuarios/${uuid}/activar`);
	}

	deleteUser(uuid: string): Promise<any> {
		return this._http.DELETE(`${this.url}/usuarios/${uuid}/eliminar`);
	}
	getUserProfile(): Promise<any> {
		return this._http.GET(`${this.url}/perfil`);
	}
	updateUserProfile(id: number, data: UpdateUserProfileRequest): Promise<any> {
		return this._http.PATCH(`${this.url}/perfil`, data);
	}
}
