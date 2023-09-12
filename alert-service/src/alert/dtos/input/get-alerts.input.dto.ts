import { IPaginationFilters } from '@cso-org/shared';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { IsValidGetAlertsFilters } from 'src/alert/validators/get-alerts-filters.validator';

export class GetAlertsInputDto {
  @IsNumber()
  @IsNotEmpty()
  page: number;

  @IsNumber()
  @IsNotEmpty()
  limit: number;

  @IsValidGetAlertsFilters()
  filters: IPaginationFilters;
}
