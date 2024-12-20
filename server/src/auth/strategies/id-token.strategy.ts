import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from '@nestjs/typeorm';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from 'typeorm';
import { RequestWithMetadata } from '../../common/interfaces/request-metadata.interface';
import { User } from '../../entities/usr/user.entity';

export class IDTokenStrategy extends PassportStrategy(Strategy, 'id-token') {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private readonly configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromBodyField('id_token'),
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
		req.idTokenDecrypted = payload
		return true;
	}
}