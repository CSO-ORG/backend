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

    const expectedProperties: string[] = ['alertType'];

    for (const prop of expectedProperties) {
      if (!(prop in filters)) {
        return false;
      }
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
      constraints: [],
      validator: IsValidGetAlertsFiltersConstraint,
    });
  };
}
