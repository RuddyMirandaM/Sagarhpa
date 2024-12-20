import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsString } from 'class-validator';
import { appPassword } from '../../common/validators/password.validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) { 
	@IsString()
	@IsEmail()
	email: string;
}
