import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { CreateAlertInputDto } from './create-alert.input.dto';

export class ImportAlertsInputDto {
  @ApiProperty({
    type: Array<CreateAlertInputDto>,
    description: 'List of alerts to alerts to be imported',
    default: [],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(10000)
  @Type(() => CreateAlertInputDto)
  alerts: CreateAlertInputDto[];
}
