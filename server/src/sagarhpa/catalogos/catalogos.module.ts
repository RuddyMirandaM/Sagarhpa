import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MunicipioCat } from '../entity/title/municipioCatalogo.entity';
import { Zona } from '../entity/title/zona.entity';
import { Agl } from '../entity/title/agl.entity';
import { CatalogsService } from './catalogos.service';
import { CatalogsController } from './catalogos.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([MunicipioCat, Zona, Agl], 'sagarhpa')
  ],
  providers: [CatalogsService],
  controllers: [CatalogsController]
})
export class CatalogosModule {}
