import { IdName, KeyName } from './commons.dto';

export interface AuthenticationResponse {
	user: UserAuthentication;
	roles: string[];
	permissions: KeyName[];
}

export interface UserAuthentication {
	uuid:           string;
	curp:           string;
	name:           string;
	firstName:      string;
	secondName:     string;
	email:          string;
	avatar:         null;
	employeeNumber: string;
	job:            null;
}
