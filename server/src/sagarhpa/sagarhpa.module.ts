import { Module } from '@nestjs/common';
import { TitleService } from './title.service';
import { TituloController } from './title.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Titulo_num } from './entity/title/title.entity';
import { Municipio } from './entity/title/municipio.entity';



@Module({
    imports: [
        TypeOrmModule.forFeature([
Titulo_num, Municipio],'marcas'
        )
    ],
    providers: [TitleService],
    controllers: [TituloController]
})

export class SagarhpaModule {}
