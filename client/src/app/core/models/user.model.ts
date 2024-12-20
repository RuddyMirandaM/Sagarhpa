
export interface UserItemResponse {
	uuid:           string;
	rfc:            string;
	employeeNumber: string;
	curp:           string;
	name:           string;
	firstName:      string;
	secondName:     string;
	avatar:         null;
	email:          string;
	suborganismId:  number;
	createdBy:      number;
	job:            string;
	isActive:       boolean;
	order:          null;
	createdAt:      string;
	updatedAt:      string;
	deletedAt:      null;
	roles:          UserRole[];
}

export interface UserRole {
	id: number;
	name: string;
}
