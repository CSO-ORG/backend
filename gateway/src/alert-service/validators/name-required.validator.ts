import { ALERT_CATEGORY } from '@cso-org/shared';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CreateAlertInputDto } from '../dtos/input/create-alert.input.dto';

@ValidatorConstraint({ async: true })
export class IsNameRequiredConstraint implements ValidatorConstraintInterface {
  validate(name: string, args: ValidationArguments) {
    const object = args.object as CreateAlertInputDto;

    if (object.alertType === ALERT_CATEGORY.LOST_PET) {
      if (name !== undefined) {
        if (
          typeof name !== 'string' ||
          name.length > 100 ||
          name.length === 0
        ) {
          return false;
        }
      }
      return name !== undefined;
    }

    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return (
      '$property is required if alertType value is ' +
      ALERT_CATEGORY.LOST_PET +
      ' and has to be a string with length less than 200 characters'
    );
  }
}

export function IsNameRequired(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNameRequiredConstraint,
    });
  };
}
