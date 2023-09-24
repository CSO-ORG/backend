import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsValidLocationConstraint implements ValidatorConstraintInterface {
  validate(location: any, args: ValidationArguments) {
    if (!location || typeof location !== 'object') {
      return false;
    }

    const expectedProperties: string[] = [
      'country',
      'city',
      'address',
      'postalCode',
      'departmentName',
      'departmentCode',
      'coords',
    ];

    for (const prop of expectedProperties) {
      if (!(prop in location)) {
        return false;
      }
    }

    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return '$property does not match the type LOCATION';
  }
}

export function IsValidLocation(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidLocationConstraint,
    });
  };
}
