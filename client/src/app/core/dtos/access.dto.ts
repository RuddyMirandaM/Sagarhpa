export interface CreateUpdateUserRequest {
	employeeNumber: string;
	rfc: string;
	curp: string;
	name: string;
	firstName: string;
	secondName: string;
	email: string;
	job: string;
	roleIds: number[];
}

export interface UpdateUserProfileRequest {
	name: string;
	firstName: string;
	secondName?: string;
	password?: string;
}

export interface CreateUpdateRoleRequest {
	name?: string;
	isActive?: boolean;
}

export interface AddRemoveRolePermissionRequest {
	roleId?: number;
	permissionKeys?: string[];
}

export interface CreateUpdatePermissionRequest {
	name?: string;
	groupId?: number;
	isActive?: boolean;
}

export interface CreateUpdateGroupRequest {
	name?: string;
	isActive?: boolean;
}
