import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Not, Repository } from 'typeorm';
import { ERRORS } from '../common/constants/errors.const';
import { FindCommonsFiltersDTO } from '../common/dtos/page-options.dto';
import { LOG_ACTIONS } from '../common/enums/log-movements.enum';
import { Group, Permission } from '../entities';
import { LoggerService } from '../system-logs/logs.service';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionsService {
	constructor(
		@InjectRepository(Permission)
		private permissionRepository: Repository<Permission>,
		@InjectRepository(Group)
		private groupRepository: Repository<Group>,
		private logger: LoggerService,
	) {
		logger.setContext(PermissionsService.name)
	}

	async findAll(pageOptionsDto: FindCommonsFiltersDTO): Promise<{ data: Permission[]; total: number; }> {

		let where: FindOptionsWhere<Permission> = {};
		if (pageOptionsDto.key) {
			where.key = pageOptionsDto.key;
		}
		const [data, total] = await this.permissionRepository.findAndCount({
			where,
			take: pageOptionsDto.take,
			skip: pageOptionsDto.skip,
			relations: { group: true }
		},);
		return { data, total }
	}

	async findByKey(key:string): Promise<Permission> {
		const permission = await this.permissionRepository.findOne({ where: { key } });
		if (!permission) {
			throw new HttpException(ERRORS.Roles_Errors.ERR008, HttpStatus.NOT_FOUND);
		}
		return permission;
	}

	async update(key: string, updatePermissionDto: UpdatePermissionDto, requestUserId: number,): Promise<void> {
		const exists = await this.permissionRepository.findOne({
			where: {
				key: Not(key),
				name: ILike(updatePermissionDto.name)
			}
		});
		if (exists) {
			throw new HttpException(ERRORS.ERR0P01, HttpStatus.BAD_REQUEST);
		}

		const permission = await this.permissionRepository.findOne({ where: { key }, relations: { group: true } })
		if (permission) {
			const oldName = permission.name
			const oldGroup = permission.group && permission.group.name
			permission.name = updatePermissionDto.name
			permission.group = this.groupRepository.create({ id: updatePermissionDto.groupId })
			await this.permissionRepository.save(permission)

			await this.logger.log(null, requestUserId, LOG_ACTIONS.EDIT, { updatedId: permission.id, name: oldName, group: oldGroup })
		}
	}
	async toggleActive(active: boolean, key: string, requestUserId: number): Promise<void> {
		await this.permissionRepository.update({ key }, { isActive: active })
		await this.logger.log(null, requestUserId, LOG_ACTIONS.TOGGLE_ACTIVE, { key, active })
	}
}
