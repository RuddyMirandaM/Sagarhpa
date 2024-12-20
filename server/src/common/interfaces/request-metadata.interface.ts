import { Request } from 'express';
import { UserRequest } from './user-request.model';
import { IDTokenDecrypted } from './id-token-decrypted.interface';

export interface RequestWithMetadata extends Request {
	currentUser: UserRequest,
	idTokenDecrypted: IDTokenDecrypted
}