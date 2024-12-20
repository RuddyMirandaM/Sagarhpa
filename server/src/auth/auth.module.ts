import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { MailProvider } from '../common/providers/mail.provider';
import { User, UserTokens } from '../entities';
import { IDTokenStrategy } from './strategies/id-token.strategy';

@Module({
	imports: [
		TypeOrmModule.forFeature([User, UserTokens]),
		UsersModule,
		PassportModule,
		JwtModule.register({
			// publicKey: `-----BEGIN PUBLIC KEY-----
			// MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr/kgvO+CAcn1tWsRuSwW
			// FDDRaWLnEmJTmAow5Bru1pWQB5M7P9JNrWqc5x9tLldjo2jOBUp3K8TIq7LrXatT
			// r0078dH3RbevFp8iQ3f/yIMjavzKyQZJqTwrllMvrR1j5YvZF81zlbrLRIWRxN/N
			// SQIYb74HHf656NyZllsvuWpYVvfBXlnNzSEHa3D8k64cfDtrsF8z9NDqXQjdticQ
			// jII3TDZqYqpymQgSFYZ/Gzx+D7YvWbFcwVrmj++477SZvA2FMPBypu8nTILY9Mtx
			// MOOeOp+lu6+X1Dnz//WlGXc61nyXUU54zVHerLMdd9h3WaPsToGrnrff89E1cQgN
			// ZwIDAQAB
			// -----END PUBLIC KEY-----`,
			// secret: process.env.JWT_SECRET_KEY,
			// signOptions: { expiresIn: '60s' },
		}),
	],
	providers: [AuthService, JwtStrategy, JwtService, MailProvider, IDTokenStrategy],
	controllers: [AuthController],
})
export class AuthModule { }
