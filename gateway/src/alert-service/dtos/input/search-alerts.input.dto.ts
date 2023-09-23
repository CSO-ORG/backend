import { ALERT_CATEGORY, IPaginationFilters } from '@cso-org/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { IsValidGetAlertsFilters } from 'src/alert-service/validators/get-alerts-filters.validator';

export class SearchAlertsInputDto {
  @ApiProperty({
    type: Number,
    description: 'page number',
    default: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
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
    default: {
      searchText: 'German shepered with brown hair',
      alertType: ALERT_CATEGORY.LOST_PET,
      breeds: ['breed 1', 'breed 2'],
      suspicious: false,
      species: ['specie 1', 'specie 2'],
      rewardRange: [100, 120],
    },
  })
  @IsValidGetAlertsFilters({ context: { type: 'search' } })
  filters: IPaginationFilters;
}
