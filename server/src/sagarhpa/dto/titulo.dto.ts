import { IsString, IsInt, IsDate, IsBase64} from '@nestjs/class-validator';


export class GetTituloDto {
  @IsInt()
  readonly titulo_num: number;


  @IsString()
  readonly status: string;

  @IsInt()
  readonly tipo: string;

  @IsDate()
  fecha_expedicion?: Date;

  @IsString()
  readonly municipio: string;

  @IsString()
  readonly asiento_produccion: string;

  @IsString()
  expedidoa2: string; 

}