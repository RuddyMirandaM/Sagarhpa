import { IsOptional, IsNumber, IsString, Min, IsDate } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class FindTitleRequestDTO {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.toString().trim())
  titulo_num?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.toString().trim())
  tipo?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.toString().trim())
  expedidoa2?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value) || 0)
  skip?: number = 0;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value) || 15)
  take?: number = 15;

  @IsOptional()
  @IsString()
  sortField?: string;
  
  @IsOptional()
  @IsString()
  municipio?: string;

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';

    constructor(partial: Partial<FindTitleRequestDTO>) {
        Object.assign(this, partial);
    }
}