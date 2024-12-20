import { HttpException, Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { compareAsc } from 'date-fns';
import { FindManyOptions, FindOptionsWhere, ILike, In, Like, Not, Repository } from 'typeorm';
import { ERRORS } from '../common/constants/errors.const';
import { FindUsersFiltersDTO } from '../common/dtos/page-options.dto';
import { LOG_ACTIONS } from '../common/enums/log-movements.enum';
import { Permission, PermissionRole, Role, RoleUser, User } from '../entities';
import { TypeToken, UserTokens } from '../entities/usr/user-tokens.entity';
import { PermissionDto } from '../permissions/dto/permission.dto';
import { RoleDto } from '../roles/dto/role.dto';
import { LoggerService } from '../system-logs/logs.service';
import { UtilsService } from '../utils.service';
import { CreateUserDto } from './dto/create-user.dto';
import { EditProfileDto } from './dto/edit-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MailProvider } from '../common/providers/mail.provider';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		@InjectRepository(Role)
		private roleRepository: Repository<Role>,
		@InjectRepository(RoleUser)
		private roleUserRepository: Repository<RoleUser>,
		@InjectRepository(UserTokens)
		private userTokensRepository: Repository<UserTokens>,
		@InjectRepository(PermissionRole)
		private permissionRoleRepository: Repository<PermissionRole>,
		private logger: LoggerService,
		private mail: MailProvider
	) {
		logger.setContext(UsersService.name)
	}
	async create(createUserDto: CreateUserDto, requestUserId: number): Promise<User> {
		const user = this.userRepository.create(createUserDto);
		user.createdBy = requestUserId;
		await this.userRepository.save(user);

		let rolesUser: RoleUser[] = []
		if (createUserDto.roleIds && createUserDto.roleIds.length) {
			const roles = await this.roleRepository.findBy({
				id: In(createUserDto.roleIds),
				isActive: true,
			});

			if (!roles) {
				throw new HttpException(ERRORS.Roles_Errors.ERR008, HttpStatus.NOT_FOUND);
			}

			rolesUser = roles.map((rol) => this.roleUserRepository.create({ role: rol, user: user }))
			await this.roleUserRepository.save(rolesUser)
		}
		user.roleUsers = rolesUser
		await this.logger.log(null, requestUserId, LOG_ACTIONS.NEW_REGISTER, { registeredId: user.id })

		await this.mail.sendMail({
			template: {
				type: 'welcome-new-user',
				username: user.name
			},
			to: [user.email],
		})
		return user;
	}

	async findAll(pageOptionsDto: FindUsersFiltersDTO): Promise<{ data: User[]; total: number; }> {
		let where: FindOptionsWhere<User> = {};
		if (pageOptionsDto.name) {
			where.name = ILike(`%${pageOptionsDto.name}%`);
		}
		if (pageOptionsDto.employeeNumber) {
			where.employeeNumber = Like(`%${pageOptionsDto.employeeNumber}%`);
		}
		if (pageOptionsDto.uuid) {
			where = {}
			where.uuid = pageOptionsDto.uuid;
		}
		if (pageOptionsDto.id) {
			where = {}
			where.id = pageOptionsDto.id;
		}
		const dbQuery: FindManyOptions<User> = {
			where,
			order: pageOptionsDto.orderByParams(),
			take: pageOptionsDto.take,
			skip: pageOptionsDto.skip,
			relations: ['roleUsers.role'],
		};
		const [data, total] = await this.userRepository.findAndCount(dbQuery);
		return { data, total }
	}

	async findOne(uuid: string): Promise<User> {
		const { data } = await this.findAll(new FindUsersFiltersDTO({ uuid }))
		const user = data && data[0];
		if (!user) {
			throw new HttpException(ERRORS.User_Errors.ERR002, HttpStatus.NOT_FOUND);
		}
		return user;
	}

	async update(uuid: string, updateUserDto: UpdateUserDto, requestUserId: number): Promise<void> {
		const existsEmail = await this.userRepository.findOne({
			where: {
				uuid: Not(uuid),
				email: updateUserDto.email,
			},
		});
		if (existsEmail) { throw new HttpException(ERRORS.Validation_errors.ERR011, HttpStatus.BAD_REQUEST,); }

		const user = await this.findOne(uuid)
		if (!user) { throw new HttpException(ERRORS.User_Errors.ERR002, HttpStatus.BAD_REQUEST,); }

		const newDataUser = this.userRepository.create(updateUserDto)
		await this.userRepository.update({ id: user.id }, newDataUser)

		let oldRoles
		if (!UtilsService.isNoE(updateUserDto.roleIds)) {
			oldRoles = user.roleUsers.map((i) => ({ id: i.roleId }))
			const roles = updateUserDto.roleIds.map((i) => new Role({ id: i }))
			const rolesUser = roles.map((rol) => new RoleUser({ role: rol, user: user }))
			await this.roleUserRepository.remove(user.roleUsers)
			await this.roleUserRepository.save(rolesUser)
		}

		await this.logger.log(null, requestUserId, LOG_ACTIONS.EDIT_USER, {
			id: user.id, email: user.email, roles: oldRoles
		})
	}

	async toggleActive(active: boolean, uuid: string, requestUserId: number): Promise<void> {
		const result = await this.userRepository.update({ uuid }, { isActive: active })
		await this.logger.log(null, requestUserId, LOG_ACTIONS.TOGGLE_ACTIVE, { id: uuid, active })
	}

	async getUserRoles(userId: number): Promise<RoleDto[]> {
		const roleUsers = await this.roleUserRepository.find({
			where: {
				userId,
			},
			relations: { role: true },
		});

		const rolesList = roleUsers.filter((i) => i.role).map((roleUser) => roleUser.role);
		const rolesDto = plainToInstance(RoleDto, rolesList);
		return rolesDto;
	}

	async getUserPermission(userId: number): Promise<PermissionDto[]> {
		const permissionRoles = await this.permissionRoleRepository.find({
			where: { role: { roleUsers: { userId }, isActive: true } },
			relations: ['role', 'permission']
		})

		return permissionRoles.map((i) => plainToInstance(PermissionDto, i.permission));
	}

	async registerUserToken(userId: number, typeToken: TypeToken, token: string, expireOn: Date) {
		let existingToken = await this.userTokensRepository.findOneBy({
			userId, typeToken
		})
		if (existingToken) {
			this.userTokensRepository.remove(existingToken)
		}
		let newToken = new UserTokens({
			userId, typeToken, token, expireOn,
		})
		return this.userTokensRepository.save(newToken)
	}
	async validateUserToken(token: string, typeToken: TypeToken, extraWhere: FindOptionsWhere<UserTokens> = null) {
		let whereClause: FindOptionsWhere<UserTokens> = { token, typeToken }
		if (extraWhere) {
			whereClause = {
				...whereClause,
				...extraWhere
			}
		}
		const ut = await this.userTokensRepository.findOneBy(whereClause)
		if (!ut) {
			throw new Error('No token found')
		}
		if (compareAsc(new Date(), ut.expireOn) === 1) {
			await this.userTokensRepository.remove(ut)
			throw new Error('Token expire')
		}
		return ut;
	}
}
