import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ZonaDTO } from '../dto/zona.dto';
import { AGLDTO } from '../dto/agl.dto';
import { MunicipiosDto } from '../dto/municipio.dto';

@Injectable()
export class CatalogsService {

  constructor(
    @InjectDataSource('sagarhpa')
    private sagarhpaDataSource: DataSource,
  ) {}

  async getMunicipios(): Promise<MunicipiosDto[]> {
    const queryStr = `
      SELECT Id, municipio
      FROM municipios
      ORDER BY municipio ASC
    `;
    
    const municipios = await this.sagarhpaDataSource.query(queryStr);
    return municipios.map(m => ({
      Id: m.Id,
      municipio: m.municipio,
    }));
  }

  async getZonas(): Promise<ZonaDTO[]> {
    const queryStr = `
      SELECT id, zona
      FROM zonas
      ORDER BY zona ASC
    `;
    
    const zonas = await this.sagarhpaDataSource.query(queryStr);
    return zonas.map(z => ({
      id: z.id.toString(),
      name: z.zona
    }));
  }

  async getAGL(): Promise<AGLDTO[]> {
    const queryStr = `
      SELECT id, agl
      FROM agl
      ORDER BY agl ASC
    `;
    
    const agls = await this.sagarhpaDataSource.query(queryStr);
    return agls.map(a => ({
      id: a.id.toString(),
      name: a.agl
    }));
  }
}