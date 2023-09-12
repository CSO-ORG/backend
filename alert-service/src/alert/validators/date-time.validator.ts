import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsValidDateTimeConstraint implements ValidatorConstraintInterface {
  validate(dateTime: any, args: ValidationArguments) {
    if (!dateTime || typeof dateTime !== 'object') {
      return false;
    }

    const expectedProperties: string[] = ['date', 'time'];

    for (const prop of expectedProperties) {
      if (!(prop in dateTime)) {
        return false;
      }
    }

    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return '$property does not match the type DATETIME';
  }
}

export function IsValidDateTime(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidDateTimeConstraint,
    });
  };
}
