import { Controller, Get, HttpException, HttpStatus, Query } from '@nestjs/common';
import { TitleService } from './title.service';
import { ConteoAnimalesDto } from './dto/ConteoAnimalesDto.dto';
import { ConteoRegistros } from 'src/auth/interfaces/conteo.interface';
import { FindTitleRequestDTO } from './dto/find-title-request.dto';
import { PaginationResponseDTO } from './dto/pagination-response.dto';
import { TitleItemResponse } from './dto/title-item-response.dto';


@Controller('title')
export class TituloController {
  constructor(private readonly tituloService: TitleService) { }

  @Get('pagination')
  async getTitles(@Query() query: FindTitleRequestDTO) {
    return await this.tituloService.findAll(query);
  }


  @Get('conteo')
  async contarAnimales(): Promise<ConteoAnimalesDto> {
    return await this.tituloService.contarAnimalesPorTipo();
  }

  @Get('conteotitulos')
  async obtenerConteo(): Promise<ConteoRegistros> {
    try {
      const resultado = await this.tituloService.contarRegistros();
      return resultado;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al obtener conteo de registros',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


}
