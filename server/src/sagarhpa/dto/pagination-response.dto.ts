export class PaginationResponseDTO<T> {
    data: T[];
    total: number;
  }
  
  // src/shared/dto/pagination-request.dto.ts
  import { IsOptional, IsNumber, Min } from 'class-validator';
  import { Type } from 'class-transformer';
  
  export class PaginationRequestDTO {
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    skip?: number = 0;
  
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    take?: number = 10;
  }