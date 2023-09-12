import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { CreateAlert2InputDto } from './create-alert2.input.dto';

export class ImportAlertsInputDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(10000)
  @Type(() => CreateAlert2InputDto)
  alerts: CreateAlert2InputDto[];
}
