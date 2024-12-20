import { IsString, IsEmail, IsOptional, IsNumber, IsArray, MaxLength, } from 'class-validator';

import { EmailNotRegistered } from '../../common/validators/email-validation';
import { appLength } from '../../common/validators/app-length.validator';

export class CreateUserDto {
	@IsString()
	@IsOptional()
	employeeNumber: string;
	
	// @IsString()
	// @MaxLength(13)
	// rfc: string;
	
	@appLength(18, 18)
	curp: string;

	@IsString()
	name: string;

	@IsString()
	@IsOptional()
	firstName: string;

	@IsString()
	@IsOptional()
	secondName: string;

	@IsString()
	@IsEmail()
	@EmailNotRegistered({ message: 'El correo ya se encuentra registrado' })
	email: string;

	@IsString()
	@IsOptional()
	job: string;

	@IsArray()
	@IsOptional()
	roleIds?: number[];
}
