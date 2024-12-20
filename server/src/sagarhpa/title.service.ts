import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Titulo_num } from './entity/title/title.entity';
import { DataSource } from 'typeorm';
import { ConteoAnimalesDto } from './dto/ConteoAnimalesDto.dto';
import { ConteoRegistros } from 'src/auth/interfaces/conteo.interface';
import { FindTitleRequestDTO } from './dto/find-title-request.dto';
import { PaginationResponseDTO } from './dto/pagination-response.dto';
import { TitleItemResponse } from './dto/title-item-response.dto';

@Injectable()
export class TitleService {
  private readonly logger = new Logger(TitleService.name)
  constructor(
    @InjectDataSource('marcas')
    private marcasDataSource: DataSource,

  ) {}

  async findAll(
    query: FindTitleRequestDTO
  ): Promise<PaginationResponseDTO<TitleItemResponse>> {
    this.logger.debug('Query params received:', query);
    
    let queryStr = `
    SELECT m.*, mu.municipio as nombre_municipio
    FROM marcas m
    LEFT JOIN municipios mu ON m.municipio = mu.Id
    WHERE 1=1
    `;

    const params: any[] = [];

    if (query.titulo_num && query.titulo_num.trim() !== '') {
      queryStr += ` AND m.titulo_num = ?`;
      params.push(query.titulo_num);
    }

    if (query.tipo && query.tipo.trim() !== '') {
      queryStr += ` AND m.tipo = ?`;  
      params.push(query.tipo);
    }

    if (query.expedidoa2 && query.expedidoa2.trim() !== '') {
      queryStr += ` AND m.expedidoa2 LIKE ?`;
      params.push(`%${query.expedidoa2}%`);
    }

    // Agregamos el filtro por municipio
    if (query.municipio && query.municipio.trim() !== '') {
      queryStr += ` AND mu.municipio = ?`;
      params.push(query.municipio);
    }

    // Ordenamiento
    if (query.sortField) {
      const field = query.sortField === 'municipio' ? 'mu.municipio' : `m.${query.sortField}`;
      queryStr += ` ORDER BY ${field} ${query.sortOrder || 'ASC'}`;
    }

    // Consulta para el total (también agregamos el filtro por municipio)
    const countQuery = `
    SELECT COUNT(*) as total
    FROM marcas m
    LEFT JOIN municipios mu ON m.municipio = mu.Id
    WHERE 1=1
    ${query.titulo_num ? ` AND CONVERT(m.titulo_num, CHAR) LIKE ?` : ''}
    ${query.tipo ? ` AND m.tipo = ?` : ''}
    ${query.expedidoa2 ? ` AND m.expedidoa2 LIKE ?` : ''}
    ${query.municipio ? ` AND mu.municipio = ?` : ''}
    `;

    const totalResult = await this.marcasDataSource.query(countQuery, params);
    const total = totalResult[0].total;

    // Paginación
    const skip = query.skip || 0;
    const take = query.take || 10;
    queryStr += ` LIMIT ? OFFSET ?`;
    params.push(take, skip);

    const data = await this.marcasDataSource.query(queryStr, params);

    // Mapeo de resultados
    const items: TitleItemResponse[] = data.map(item => ({
      titulo_num: item.titulo_num.toString(),
      tipo: item.tipo,
      expedidoa2: item.expedidoa2,
      municipio: item.nombre_municipio || '',
      asiento_produccion: item.asiento_produccion,
      fecha_expedicion: item.fecha_expedicion,
      status: item.status
    }));

    return {
      data: items,
      total
    };
  }

  async contarAnimalesPorTipo(): Promise<ConteoAnimalesDto> {
    const result = await this.marcasDataSource.query('CALL contar_registros_por_tipo()');
    return result[0] as ConteoAnimalesDto;
  }

  async contarRegistros(): Promise<ConteoRegistros> {
    try {
      const result = await this.marcasDataSource.query('CALL ContarRegistros()');
      return result[0][0];
    } catch (error) {
      throw new Error(`Error al ejecutar ContarRegistros: ${error.message}`);
    }
  }
  async getMunicipios(): Promise<string[]> {
    const queryStr = `
      SELECT DISTINCT municipio
      FROM municipios
      ORDER BY municipio ASC
    `;
    
    const result = await this.marcasDataSource.query(queryStr);
    return result.map(item => item.municipio);
  }



  
}