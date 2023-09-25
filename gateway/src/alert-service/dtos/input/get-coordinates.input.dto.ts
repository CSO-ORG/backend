import { ALERT_CATEGORY, IPaginationFilters } from '@cso-org/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IsValidGetAlertsFilters } from 'src/alert-service/validators/get-alerts-filters.validator';

export class GetCoordinatesInputDto {
  @ApiProperty({
    type: Object,
    description: 'list of options',
    default: {
      alertType: ALERT_CATEGORY.LOST_PET,
    },
  })
  @IsValidGetAlertsFilters({ context: { type: 'getAll' } })
  filters: IPaginationFilters;
}
