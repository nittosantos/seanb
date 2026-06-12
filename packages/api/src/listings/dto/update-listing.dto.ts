import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateListingDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  price?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lng?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsString()
  boatName?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  boatGuests?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  boatCabins?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  boatBathrooms?: number;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsBoolean()
  hasCaptain?: boolean;

  @IsOptional()
  equipment?: unknown;

  @IsOptional()
  specifications?: unknown;

  @IsOptional()
  @IsString()
  boatType?: string;
}
