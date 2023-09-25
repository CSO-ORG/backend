import { IPaginationFilters } from '@cso-org/shared';
import { IsValidGetAlertsFilters } from 'src/alert/validators/get-alerts-filters.validator';

export class GetCoordinatesInputDto {
  @IsValidGetAlertsFilters({ context: { type: 'getAll' } })
  filters: IPaginationFilters;
}
