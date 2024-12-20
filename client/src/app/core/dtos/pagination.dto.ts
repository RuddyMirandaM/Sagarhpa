import { TableLazyLoadEvent } from 'primeng/table';
import { convertToHttpParams, removeNullProperties } from '../../shared/functions';
import { HttpParams } from '@angular/common/http';

export interface PaginationResponseDTO<T> {
	data: T[]
	total: number
	skip?: number
	take?: number
}

export class QueryDataState {
	skip?: number
	take?: number
	sort?: Array<any>;
	$search?: string
	constructor(data: Partial<QueryDataState>) {
		Object.assign(this, data)
	}
	set(data: TableLazyLoadEvent) {
		this.skip = data.first ?? this.skip
		this.take = data.rows ?? this.take
	}
	clear() {
		const excludedKeys: (keyof this)[] = ['skip', 'take'];
		Object.keys(this).forEach((key) => {
			if (!excludedKeys.includes(key as keyof this)) {
				(this as Record<string, any>)[key] = null;
			}
		});
	}
	toPlain(): HttpParams {
		let cloned: any = Object.assign({}, this)
		delete cloned.filter
		delete cloned.group
		cloned = {
			...cloned,
			sort: this.sort && this.sort.length && this.sort.map((i) => `${i.dir == 'asc' ? '+' : '-'}${i.field}`).join(',') || undefined
		}
		return convertToHttpParams(removeNullProperties(cloned))
	}
}
export class FindUsersRequestDTO extends QueryDataState {
	// filters
	name: string = ''
	employeeNumber: string = ''
	role?: number
}
export class FindGroupsRequestDTO extends QueryDataState {
	permissions?: boolean
	active?: boolean
}

export class FindTitleRequestDTO extends QueryDataState {
	titulo_num?: string;
	status?: string;
	tipo?: string;
	fecha_expedicion?: Date;
	expedidoa2?: string;

	message?: string
	seguimiento?: string;
	// Campos de ubicación/zona
	municipio?: string;
	zona?: string;
	agl?: string;
	sortField?: string;
	sortOrder?: 'ASC' | 'DESC';

}

export interface PaginationResponse<T> {
	data: T[];
	meta: MetaPaginationResponse;
}

export interface UserPaginationResponse {
	id: number;
	name: string;
	avatar: null;
	email: string;
	password: string;
	suborganismId: null;
	createdBy: null;
	hashedRT: null;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date;
}

export interface RolePaginationResponse {
	id: number;
	name: string;
	route: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date;
}

export interface GroupPaginationResponse {
	id: number;
	name: string;
	route: string;
	permissions: any[];
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date;
}


export interface PermissionPaginationResponse {
	id: number;
	name: string;
	groupId: number;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date;
}

export interface PermissionsPaginationResponse {
	id: number;
	name: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date;
}

export interface GroupsPaginationResponse {
	id: number;
	name: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date;
}

export interface MetaPaginationResponse {
	itemCount: number;
	pageCount: null;
	hasPreviousPage: boolean;
	hasNextPage: boolean;
}
