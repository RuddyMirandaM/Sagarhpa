import { ExecutionContext, SetMetadata, UnauthorizedException, createParamDecorator } from '@nestjs/common';
import { TypePermissions } from '../enums/access.enum';
import { UserRequest } from '../interfaces/user-request.model';
import { UtilsService } from '../../utils.service';
import { RequestWithMetadata } from '../interfaces/request-metadata.interface';

export const PUBLIC_DECORATOR_KEY = 'isPublic'
export const PERMISSIONS_DECORATOR_KEY = 'permissions'

export const Permissions = (...permissions: string[]) => SetMetadata(PERMISSIONS_DECORATOR_KEY, permissions);

export const Public = () => SetMetadata(PUBLIC_DECORATOR_KEY, true);

export const GetCurrentUserId = createParamDecorator(
	(data: undefined, context: ExecutionContext): number => {
		const request: RequestWithMetadata = context.switchToHttp().getRequest();
		return request.currentUser.id;
	},
);

export const GetCurrentUser = createParamDecorator(
	(data: string | undefined, context: ExecutionContext) => {
		const request: RequestWithMetadata = context.switchToHttp().getRequest();
		if (!data) return request.currentUser;
		return request.currentUser[data];
	},
);
