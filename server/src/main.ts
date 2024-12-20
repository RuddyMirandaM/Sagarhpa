import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { DTOValidationException } from './common/exceptions/dto-validation.exception';
import * as path from 'path';
import { AppSettings } from './app.settings';

const logger = new Logger('Bootstrap');
async function bootstrap() {
	const prod = process.env.PRODUCTION
	if (typeof prod == 'undefined') {
		throw new Error('The PRODUCTION variable is not defined in the .env file')
	}

	AppSettings.production = prod === 'true'
	AppSettings.basepath = path.join(__dirname, '../')
	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix('api');
	app.enableCors();
	const options = new DocumentBuilder()
		.setTitle('Nest-base')
		.setDescription('Documentation for nest base project')
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('docs', app, document);
	app.useGlobalPipes(new ValidationPipe({
		whitelist: true, transform: true, exceptionFactory: (validationErrors = []) => {
			return new DTOValidationException('', validationErrors);
		},
	}));
	useContainer(app.select(AppModule), { fallbackOnErrors: true });
	app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
	await app.listen(process.env.PORT);
	logger.log(`Server running on port ${process.env.PORT}`);
}
bootstrap();
