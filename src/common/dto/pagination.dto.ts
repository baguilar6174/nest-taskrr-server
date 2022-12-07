import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationQueryDto {
  // Cantidad de elementos a obtener de la BD
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type((): NumberConstructor => Number)
  limit?: number;

  // Cuantos elementos saltar
  @IsNumber()
  @IsOptional()
  @Type((): NumberConstructor => Number)
  @Min(0)
  offset?: number;
}
