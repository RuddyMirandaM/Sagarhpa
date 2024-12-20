import { Controller, Get } from '@nestjs/common';
import { CatalogsService } from './catalogos.service';

@Controller('catalogos')
export class CatalogsController {
    constructor(private readonly catalogsService: CatalogsService) {}
  
    @Get('municipios')
    getMunicipios() {
      return this.catalogsService.getMunicipios();
    }
  
    @Get('zonas')
    getZonas() {
      return this.catalogsService.getZonas();
    }
  
    @Get('agl')
    getAGL() {
      return this.catalogsService.getAGL();
    }

    

    
  }