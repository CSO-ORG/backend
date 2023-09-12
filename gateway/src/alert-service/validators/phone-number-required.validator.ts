import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CreateAlertInputDto } from '../dtos/input/create-alert.input.dto';

@ValidatorConstraint({ async: true })
export class IsPhoneNumberRequiredConstraint
  implements ValidatorConstraintInterface
{
  validate(publisherPhoneNumber: string, args: ValidationArguments) {
    const object = args.object as CreateAlertInputDto;

    if (
      typeof object.publisherEmail !== 'undefined' &&
      object.publisherEmail !== null &&
      object.publisherEmail !== ''
    ) {
      // Phone number is not required
      return true;
    }

    // Phone number is required if email is not provided or is null or an empty string
    return !!publisherPhoneNumber;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return '$property is required and has to be a string';
  }
}

export function IsPhoneNumberRequired(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPhoneNumberRequiredConstraint,
    });
  };
}
