import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { KeyName } from '../../common/interfaces/commons.interface';
import { User } from '../../entities/usr/user.entity';
import { PartialType } from '@nestjs/mapped-types';

export class LoginDto {
	user: UserLoginDto;
	permissions: KeyName[];
	roles: string[];
	// accessToken: string;
	// refreshToken: string;
	constructor(user: User) {
		this.user = plainToInstance(UserLoginDto, user)
	}
}

@Exclude()
export class UserLoginDto extends PartialType(User) {
	@Expose()
	uuid: string;
	@Expose()
	curp: string;
	@Expose()
	name: string;
	@Expose()
	firstName: string;
	@Expose()
	secondName?: string;
	@Expose()
	email: string;
	@Expose()
	avatar?: string;
	@Expose()
	employeeNumber?: string;
	@Expose()
	job?: string;
}
