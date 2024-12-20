import { IsString, IsInt} from '@nestjs/class-validator';


export class MunicipiosDto {

  @IsInt()
  readonly Id: string;



  @IsString()
  readonly municipio: string;


}