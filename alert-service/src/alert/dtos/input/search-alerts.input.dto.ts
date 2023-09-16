import { IPaginationFilters } from '@cso-org/shared';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { IsValidGetAlertsFilters } from 'src/alert/validators/get-alerts-filters.validator';

export class SearchAlertsInputDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  page: number;

  @IsNumber()
  @IsNotEmpty()
  limit: number;

  @IsValidGetAlertsFilters({ context: { type: 'search' } })
  filters: IPaginationFilters;
}
