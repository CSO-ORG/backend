import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CreateAlertInputDto } from '../dtos/input/create-alert.input.dto';

@ValidatorConstraint({ async: true })
export class IsEmailRequiredConstraint implements ValidatorConstraintInterface {
  validate(publisherEmail: string, args: ValidationArguments) {
    const object = args.object as CreateAlertInputDto;

    if (
      typeof object.publisherPhoneNumber !== 'undefined' &&
      object.publisherPhoneNumber !== null &&
      object.publisherPhoneNumber !== ''
    ) {
      // Email is not required
      return true;
    }

    // Email is required if phone number is not provided or is null or an empty string
    return !!publisherEmail;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return '$property is required and has to be a string';
  }
}

export function IsEmailRequired(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailRequiredConstraint,
    });
  };
}
