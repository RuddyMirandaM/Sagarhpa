import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { PaginationResponseDTO, FindTitleRequestDTO, ConteoRegistros } from '../dtos';
import { HttpService } from '../services';
import { TitleItemResponse } from '../models/title.model';
import { animales } from '../dtos';
import { MunicipioOption } from '../dtos/municipios.dto';
import { MunicipiosDto } from '../dtos/municipioresponse.dto';
import { ZonaOption } from '../dtos/zona-response.dto';
import { AGLOption } from '../dtos/agl-response.dto';

@Injectable({
  providedIn: 'root'
})
export class TitulosService {
  private apititulios = environment.api_titulo;
  private apicatalogos = environment.api_catalogos;

  constructor(
    private _http: HttpService,
  ) { }



  async contarAnimales(): Promise<animales[]> {
    return this._http.request('GET', `${this.apititulios}/conteo`);
  }


  async contarRegistros(): Promise<ConteoRegistros> {

      // Asume que la ruta es /title/conteo como definimos en el controller de NestJS
      return this._http.request('GET', `${this.apititulios}/conteotitulos`);

  }


  async getTitles(query: FindTitleRequestDTO): Promise<PaginationResponseDTO<TitleItemResponse>> {
    // Crear objeto de parámetros base
    const params: Record<string, string> = {
      skip: (query.skip ?? 0).toString(),
      take: (query.take ?? 15).toString()
    };

    let queryStr = `
    SELECT t.*, m.municipio as municipio
    FROM titulos t
    LEFT JOIN municipios m ON t.municipio = m.Id
    WHERE 1=1
    `;

    // Agregar parámetros opcionales asegurando que sean strings
    if (query.$search !== undefined) {
      params.search = String(query.$search);
    }
    
    if (query.sortField !== undefined) {
      params.sortField = String(query.sortField);
    }
    
    if (query.sortOrder !== undefined) {
      params.sortOrder = String(query.sortOrder);
    }


        // Agregar solo los filtros que tienen valor
        if (query.titulo_num) params.titulo_num = query.titulo_num;
        if (query.tipo) params.tipo = query.tipo;
        if (query.expedidoa2) params.expedidoa2 = query.expedidoa2;
        if (query.municipio) params.municipio = query.municipio;
    
        console.log('Enviando parámetros al backend:', params);

    const queryString = new URLSearchParams(params).toString();
    return this._http.request('GET', `${this.apititulios}/pagination?${queryString}`);
  }

  async getMunicipios(): Promise<MunicipioOption[]> {
    const response = await this._http.request<any[]>('GET', `${this.apicatalogos}/municipios`);
    return (response as any[]).map(item => ({
      id: item.municipio,    // Convertimos el municipio en id
      name: item.municipio   // Y también lo usamos como name
    }));
  }

  async getZonas(): Promise<ZonaOption[]> {
    const response = await this._http.request<any[]>('GET', `${this.apicatalogos}/zonas`);
    return response.map(item => ({
      id: item.id.toString(),
      name: item.name
    }));
  }

  async getAGL(): Promise<AGLOption[]> {
    const response = await this._http.request<any[]>('GET', `${this.apicatalogos}/agl`);
    return response.map(item => ({
      id: item.id.toString(),
      name: item.name
    }));
  }
}