import { ForbiddenException } from '@nestjs/common';
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from '@nestjs/typeorm';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from 'typeorm';
import { RequestWithMetadata } from '../../common/interfaces/request-metadata.interface';
import { UserRequest } from '../../common/interfaces/user-request.model';
import { User } from '../../entities/usr/user.entity';
import { ConfigService } from '@nestjs/config';

export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private readonly configService: ConfigService
		) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			passReqToCallback: true,
			algorithms: ['RS256'],
			secretOrKeyProvider: passportJwtSecret({
				cache: true,
				cacheMaxEntries: 5,
				cacheMaxAge: 600000,
				rateLimit: false,
				jwksUri: configService.get<string>('SIDU_JWKS_URL'),
			}),
		})
	}
	async validate(req: RequestWithMetadata, payload: any) {
		const user = await this.userRepository.findOne({
			where: {
				siduId: payload.id,
				isActive: true
			},
		});
		if (!user) {
			throw new ForbiddenException()
		}
		req.currentUser = new UserRequest(user)
		return true;
	}
}