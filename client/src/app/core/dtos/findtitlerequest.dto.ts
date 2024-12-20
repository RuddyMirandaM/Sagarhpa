import { TableLazyLoadEvent } from 'primeng/table';
import { QueryDataState } from './pagination.dto';


export class FindTitleRequestDTO extends QueryDataState  {


   // Campos de búsqueda básicos
   titulo_num?: string;
   tipo?: string;
   expedidoa2?: string;
   status?: string;
   fecha_expedicion?: Date;
   message?: string;
   seguimiento?: string;

   // Campos de ubicación/zona
   municipio?: string;
   zona?: string;
   agl?: string;

//    skip: number = 0;
//    take: number = 15;
  search?: string;
  sortField?: string;
  sortOrder?: 'ASC' | 'DESC';

//   constructor(partial?: Partial<FindTitleRequestDTO>) {
//     this.skip = partial?.skip ?? 0;
//     this.take = partial?.take ?? 15;
//     this.titulo_num = partial?.titulo_num;
//     this.tipo = partial?.tipo;
//     this.expedidoa2 = partial?.expedidoa2;
//     this.sortField = partial?.sortField;
//     this.sortOrder = partial?.sortOrder;
// }

//   set(state: TableLazyLoadEvent) {
//     this.skip = state.first ?? 0;
//     this.take = state.rows ?? 15;
    
//     if (state.sortField) {
//         this.sortField = Array.isArray(state.sortField) 
//             ? state.sortField[0] 
//             : state.sortField;
        
//         this.sortOrder = state.sortOrder === 1 ? 'ASC' : 'DESC';
//     } else {
//         this.sortField = undefined;
//         this.sortOrder = undefined;
//     }

//     if (state.filters && 'global' in state.filters) {
//         const globalFilter = state.filters['global'];
//         if (globalFilter && 'value' in globalFilter) {
//             this.search = globalFilter.value?.toString();
//         }
//     }
// }

// clear() {
//     this.skip = 0;
//     this.take = 15;
//     this.titulo_num = undefined;
//     this.tipo = undefined;
//     this.expedidoa2 = undefined;
//     this.sortField = undefined;
//     this.sortOrder = undefined;
// }
}