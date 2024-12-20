import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

import { Reflector } from '@nestjs/core';
import { PERMISSIONS_DECORATOR_KEY, PUBLIC_DECORATOR_KEY } from '../decorators/commons.decorator';
import { UsersService } from '../../users/users.service';
import { UtilsService } from '../../utils.service';
import { UserRequest } from '../interfaces/user-request.model';
import { RequestWithMetadata } from '../interfaces/request-metadata.interface';



@Injectable()
export class PermissionsGuard implements CanActivate {
	constructor(private reflector: Reflector,
		private _user: UsersService
	) { }
	async canActivate(
		context: ExecutionContext,
	) {
		const isPublic = this.reflector.getAllAndOverride(PUBLIC_DECORATOR_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (isPublic) { return true; }

		const req: RequestWithMetadata = context.switchToHttp().getRequest()
		const classPermissions = this.reflector.get<string[]>(PERMISSIONS_DECORATOR_KEY, context.getClass());
		const routePermissions = this.reflector.get<string[]>(PERMISSIONS_DECORATOR_KEY, context.getHandler());

		const user: UserRequest = req.currentUser

		const permissions= await this._user.getUserPermission(user.id) || []
		const userPermissionsKeys = permissions.map((i) => i.key)
		user.permissionsIds = permissions.map((i) => i.id)

		if (!classPermissions && !routePermissions) {
			return true;
		}
		let valid = true
		if (classPermissions) {
			const match = UtilsService.matchArrays(userPermissionsKeys, classPermissions)
			valid = match.length > 0
		}
		if (valid && routePermissions) {
			const match = UtilsService.matchArrays(userPermissionsKeys, routePermissions)
			valid = match.length > 0
		}
		return valid;
	}
}
