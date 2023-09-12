import { ALERT_CATEGORY, IPaginationFilters } from '@cso-org/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { IsValidGetAlertsFilters } from 'src/alert-service/validators/get-alerts-filters.validator';

export class GetAlertsInputDto {
  @ApiProperty({
    type: Number,
    description: 'page number',
    default: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  page: number;

  @ApiProperty({
    type: Number,
    description: 'number of alerts to retrieve',
    default: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  limit: number;

  @ApiProperty({
    type: Object,
    description: 'list of options',
    default: { alertType: ALERT_CATEGORY.LOST_PET },
  })
  @IsValidGetAlertsFilters()
  filters: IPaginationFilters;
}
