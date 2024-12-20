import { Controller, Get, HttpCode, HttpStatus, Ip, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetCurrentUserId, Public } from '../common/decorators/commons.decorator';
import { RequestWithMetadata } from '../common/interfaces/request-metadata.interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
	) { }

	@Post('login')
	@Public() // para no pasar por los Guard de JWT y Permissions
	@UseGuards(AuthGuard('id-token')) // la strategy id-token
	async login(@Req() req: RequestWithMetadata, @Ip() ip: string) {
		return this.authService.signin(req.idTokenDecrypted, ip)
	}
	
	// endpoint para verificar el access token, no se necesita procesar informacion, accede al JwtStrategy
	@Get('verify')
	@HttpCode(HttpStatus.NO_CONTENT)
	verify() { }

	@Post('logout')
	@HttpCode(HttpStatus.NO_CONTENT)
	logout(@GetCurrentUserId() userId: number) {
		try {
			this.authService.logout(userId);
		} catch (error) { }
	}
}
