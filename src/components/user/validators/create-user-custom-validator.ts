import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'nameContainsNumber', async: false })
export class CustomNameContainsNumber implements ValidatorConstraintInterface {
  validate(name: string) {
    return !/[0-9]/.test(name);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} cannot contains number.`;
  }
}
