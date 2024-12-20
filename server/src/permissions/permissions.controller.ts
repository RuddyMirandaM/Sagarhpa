import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Query, } from '@nestjs/common';
import { GetCurrentUserId, Permissions } from '../common/decorators/commons.decorator';
import { FindCommonsFiltersDTO, PaginationResponseDTO } from '../common/dtos/page-options.dto';
import { TypePermissions } from '../common/enums/access.enum';
import { Permission } from '../entities';
import { PermissionDto } from './dto/permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionsService } from './permissions.service';

@Controller('permisos')
@Permissions(TypePermissions.PERMISSONS_MODULE)
export class PermissionsController {
	constructor(private readonly permissionsService: PermissionsService) { }

	@Get()
	async findAll(@Query() pageOptionsDto: FindCommonsFiltersDTO): Promise<PaginationResponseDTO<PermissionDto>> {
		const filtered = await this.permissionsService.findAll(pageOptionsDto);
		return new PaginationResponseDTO({
			total: filtered.total,
			data: filtered.data.map((i) => new PermissionDto(i)),
			skip: pageOptionsDto.skip,
			take: pageOptionsDto.take
		})
	}

	@Get(':key')
	findOne(@Param('key') key: string): Promise<Permission> {
		return this.permissionsService.findByKey(key);
	}

	@Patch(':key/editar')
	@HttpCode(HttpStatus.NO_CONTENT)
	update(@Param('key') key: string, @Body() updatePermissionDto: UpdatePermissionDto, @GetCurrentUserId() userId: number): Promise<void> {
		return this.permissionsService.update(key, updatePermissionDto, userId);
	}

	@Patch(':key/desactivar')
	@HttpCode(HttpStatus.NO_CONTENT)
	remove(@Param('key') key: string, @GetCurrentUserId() userId: number,): Promise<void> {
		return this.permissionsService.toggleActive(false, key, userId);
	}

	@Patch(':key/activar')
	@HttpCode(HttpStatus.NO_CONTENT)
	active(@Param('key') key: string, @GetCurrentUserId() userId: number,): Promise<void> {
		return this.permissionsService.toggleActive(true, key, userId);
	}
}
