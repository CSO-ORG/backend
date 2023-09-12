import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { CreateAlert2InputDto } from './create-alert2.input.dto';

export class ImportAlertsInputDto {
  @ApiProperty({
    type: Array<CreateAlert2InputDto>,
    description: 'List of alerts to alerts to be imported',
    default: [],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(10000)
  @Type(() => CreateAlert2InputDto)
  alerts: CreateAlert2InputDto[];
}
