import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { CreateAlertInputDto } from './create-alert.input.dto';

export class ImportAlertsInputDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(10000)
  @Type(() => CreateAlertInputDto)
  alerts: CreateAlertInputDto[];
}
