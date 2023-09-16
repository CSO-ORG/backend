import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsValidGetAlertsFiltersConstraint
  implements ValidatorConstraintInterface
{
  validate(filters: any, args: ValidationArguments) {
    if (!filters || typeof filters !== 'object') {
      return false;
    }

    const type = args.constraints[0]?.context?.type ?? 'getAll';

    const hasSearchText = 'searchText' in filters;
    const hasAlertType = 'alertType' in filters;

    if (Object.keys(filters).length === 0) {
      return false;
    }

    if (type === 'search' && !hasSearchText) {
      return false;
    }

    if (type === 'getAll' && !hasAlertType) {
      return false;
    }

    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return '$property does not match the type IPaginationFilters';
  }
}

export function IsValidGetAlertsFilters(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [validationOptions],
      validator: IsValidGetAlertsFiltersConstraint,
    });
  };
}
