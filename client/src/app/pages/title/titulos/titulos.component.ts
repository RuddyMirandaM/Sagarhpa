import { Component, OnInit } from '@angular/core';
import { FindTitleRequestDTO, PaginationResponseDTO } from '../../../core/dtos';
import { TitleItemResponse } from '../../../core/models/title.model';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { NgArrayPipesModule } from 'ngx-pipes';
import { NgClass, DatePipe } from '@angular/common';
import { PrimeTemplate } from 'primeng/api';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PageContentComponent } from '../../../layouts/main-layout/components';
import { InputComponent } from '../../../shared/components';
import { LoadingComponent } from "../../../shared/components/loading/loading.component";
import { SelectComponent } from "../../../shared/components/select/select.component";
import { JsonPipe } from '@angular/common';
import { TitulosService } from '../../../core/services/titulos.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MunicipioOption } from '../../../core/dtos/municipios.dto';

@Component({
  templateUrl: './titulos.component.html',
  standalone: true,
  imports: [
    PageContentComponent, 
    JsonPipe, 
    InputComponent, 
    TableModule,
    FormsModule, 
    RouterLink, 
    PrimeTemplate, 
    NgClass, 
    NgArrayPipesModule, 
    LoadingComponent, 
    SelectComponent,
    DatePipe
  ]
})
export class TitulosComponent implements OnInit {
  private searchSubject = new Subject<string>();
  gridData2: PaginationResponseDTO<TitleItemResponse> = { data: [], total: 0 };
  state2: FindTitleRequestDTO = new FindTitleRequestDTO({
    skip: 0,
    take: 15,
  });

 

  tipoOptions = [
	{ id: '1', name: 'Ganado' },
	{ id: '2', name: 'Colmena' }
];

municipioOptions: MunicipioOption[] = [];
selectedMunicipio: Record<string, any> | undefined;  
zonaOptions = [
	{ id: '1', name: 'Zona 1' },
	{ id: '2', name: 'Zona 2' }
];

aglOptions = [
	{ id: '1', name: 'AGL 1' },
	{ id: '2', name: 'AGL 2' }
];

selectedItem?: any;
selectedZona?: any;
selectedAGL?: any;

  constructor(private _title: TitulosService) {}

  async  ngOnInit() {
    this.getList();
    this.loadMunicipios();
    
    // Configurar el debounce para la búsqueda
    this.searchSubject.pipe(
      debounceTime(600),  // espera 300ms después de la última tecla
      distinctUntilChanged()
    ).subscribe(() => {
      this.getList();
    });
    try {
      // Cargar las opciones al inicializar el componente
      [this.zonaOptions, this.aglOptions] = await Promise.all([
        this._title.getZonas(),
        this._title.getAGL()
      ]);
    } catch (error) {
      console.error('Error al cargar los catálogos:', error);
      // Aquí puedes manejar el error como prefieras, por ejemplo mostrar un mensaje
    }
  }

  onPropietarioChange(value: string) {
    this.state2.expedidoa2 = value;
    this.searchSubject.next(value);
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }


  async getList() {
    try {
      console.log('Estado antes de la búsqueda:', this.state2);
      
      const searchParams = {
        skip: this.state2.skip || 0,
        take: this.state2.take || 15,
        titulo_num: this.state2.titulo_num,
        tipo: this.selectedItem?.id || this.selectedItem,
        expedidoa2: this.state2.expedidoa2,
        // Agregamos el filtro de municipio
        municipio: this.selectedMunicipio?.name || undefined
      };

      this.state2 = new FindTitleRequestDTO(searchParams);
      console.log('Parámetros de búsqueda:', this.state2);
      
      this.gridData2 = await this._title.getTitles(this.state2);
    } catch (error) {
      console.error('Error al obtener títulos:', error);
    }
  }

  onMunicipioChange() {
    this.getList(); // Actualiza la lista cuando cambia el municipio
  }
    // Método opcional para mostrar el nombre en la UI mientras se usa el id en la búsqueda
    getTipoName(id: string | number): string {
      // Convertimos id a string para asegurar la comparación
      const idString = id?.toString();
      const option = this.tipoOptions.find(opt => opt.id === idString);
      return option ? option.name : id?.toString() || '';
    }

  public async dataStateChange(state: TableLazyLoadEvent) {
    // En lugar de asignar directamente, usamos el método set del DTO
    this.state2.set(state);
    await this.getList();
  }

  clearFilters() {
    this.state2.clear();
    this.selectedItem = undefined;
    this.selectedMunicipio = undefined; // Limpiar también el municipio
    this.getList();
  }


  async loadMunicipios() {
    try {
      this.municipioOptions = await this._title.getMunicipios();
    } catch (error: any) {

    }
  }

  onZonaChange() {
    console.log('Zona seleccionada:', this.selectedZona);
  }

  onAGLChange() {
    console.log('AGL seleccionado:', this.selectedAGL);
  }
}