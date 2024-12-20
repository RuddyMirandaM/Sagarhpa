import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CatalogResponse } from '../dtos';
import { HttpService } from './http.service';

export type CatalogoSACType =
	| 'niveles'
	| 'poderes'
	| 'tipo-organismo'
	| 'organismo'
	| 'suborganismo'
	| 'roles';

@Injectable({
	providedIn: 'root',
})
export class CatalogsService {
	private url = environment.api_url;
	private sacApiUrl = environment.api_sac_url;
	private sacApiKey = environment.api_key;
	// private spmrApiUrl = environment.api_spmr_url;
	constructor(private _http: HttpService) { }

	getCatalogo(catalog: CatalogoSACType, id?: any): Promise<CatalogResponse[]> {
		return this._http.GET(
			`${this.url}/catalogo/${catalog}${id ? '/' + id : ''}`
		);
	}

	activeCatalogoItem(
		catalogo: CatalogoSACType,
		id: any,
		active: boolean
	): Promise<any> {
		return this._http.POST(`${this.url}/catalogo/${catalogo}/active`, {
			id,
			active,
		});
	}

	getSACCatalog<T>(catalog: string, id?: any): Promise<T[]> {
		return this._http.request('GET', `${this.sacApiUrl}/catalogo/${catalog}${id ? '/' + id : ''}`,
			{
				headers: new HttpHeaders({ 'x-api-key': this.sacApiKey })
			}
		);
	}
	getPostalCodeInfo(postalCode: string) {
		return this._http.request('GET', `${this.sacApiUrl}/catalogo/codigo-postal/${postalCode}`,
			{
				headers: new HttpHeaders({ 'x-api-key': this.sacApiKey })
			},
		);
	}
}
