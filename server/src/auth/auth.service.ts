import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ERRORS } from '../common/constants/errors.const';
import { LOG_ACTIONS } from '../common/enums/log-movements.enum';
import { IDTokenDecrypted } from '../common/interfaces/id-token-decrypted.interface';
import { User } from '../entities/usr/user.entity';
import { LoggerService } from '../system-logs/logs.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {

	constructor(
		@InjectRepository(User) private userRepository: Repository<User>,
		private _user: UsersService,
		private logger: LoggerService,
	) {
		logger.setContext(AuthService.name)
	}

	async signin(idToken: IDTokenDecrypted, ip: string) {
		let user = await this.userRepository.findOneBy([{ siduId: idToken.sub }, { curp: idToken.curp }])

		if (!user) {
			throw new HttpException(ERRORS.User_Errors.ERR002, HttpStatus.NOT_FOUND);
		}

		if (!user.siduId || idToken.sub != user.siduId) {
			await this.updateFromSIDU(user.id, idToken)
			user.siduId = idToken.sub
		}

		const userResponse = new LoginDto(user);
		userResponse.permissions = (await this._user.getUserPermission(user.id) || []).map((i) => ({ key: i.key, name: i.name }));
		userResponse.roles = (await this._user.getUserRoles(user.id) || []).map((i) => i.name,);

		await this.logger.log(null, user.id, LOG_ACTIONS.LOGIN, { ip });
		return userResponse;
	}
	async updateFromSIDU(userId: number, idToken: IDTokenDecrypted) {
		const data: Partial<User> = {
			siduId: idToken.sub,
			name: idToken.nombre,
			firstName: idToken.primer_apellido,
			secondName: idToken.segundo_apellido,
			email: idToken.correo,
			employeeNumber: idToken.numero_empleado,
			job: idToken.puesto
		}
		await this.userRepository.update({ id: userId }, data)
		await this.logger.log(null, userId, LOG_ACTIONS.UPDATE_USER_SIDU, data as any)
	}

	async logout(userId: number): Promise<boolean> {
		await this.logger.log(null, userId, LOG_ACTIONS.LOGOUT)
		return true;
	}
}
