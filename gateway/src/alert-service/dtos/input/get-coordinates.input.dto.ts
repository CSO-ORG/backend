import { ALERT_CATEGORY, IPaginationFilters } from '@cso-org/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IsValidGetAlertsFilters } from 'src/alert-service/validators/get-alerts-filters.validator';

export class GetCoordinatesInputDto {
  @ApiProperty({
    type: Object,
    description: 'list of options',
    default: {
      alertType: ALERT_CATEGORY.LOST_PET,
      breeds: ['breed 1', 'breed 2'],
      suspicious: false,
      cities: ['Nantes', 'Paris'],
      departmentCodes: ['44', '77', '22'],
      species: ['specie 1', 'specie 2'],
      rewardRange: [100, 120],
    },
  })
  @IsValidGetAlertsFilters({ context: { type: 'getAll' } })
  filters: IPaginationFilters;
}
