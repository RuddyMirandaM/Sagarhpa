export interface RolesItemResponse {
	id: number;
	name: string;
	permissions?: PermissionItemResponse[];
	isActive: boolean;


	route?: any
	order?:any
	createdBy?: any
	createdAt?: any
	updatedAt?: any
	deletedAt?: any
}

export interface PermissionItemResponse {
	key: string;
	name: string;
	group?: {
		id: number;
		name: string;
	};
	isActive: boolean;

	route?: any
	order?:any
	createdBy?: any
	createdAt?: any
	updatedAt?: any
	deletedAt?: any
}

export interface PermissionCatalogForm {
	key:string;
	name: string;
	group?: {
		id: number;
		name: string;
	};
	checked?: boolean;
	isActive: boolean;
}

export interface GroupItemResponse {
	id: number;
	name: string;
	permissions?: PermissionCatalogForm[];
	isActive: boolean;
}

