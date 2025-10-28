import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {
  // Common regex patterns
  private patterns = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    phone: /^\+?[\d\s-]{10,15}$/,
    zipCode: /^\d{5}(-\d{4})?$/,
    url: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
    creditCard: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/
  };

  constructor() { }

  // Generic regex validator
  regexValidator(pattern: RegExp, errorName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null;
      }

      const valid = pattern.test(control.value);
      return valid ? null : { [errorName]: { value: control.value } };
    };
  }

  // Predefined validators
  emailValidator(): ValidatorFn {
    return this.regexValidator(this.patterns.email, 'invalidEmail');
  }

  passwordValidator(): ValidatorFn {
    return this.regexValidator(this.patterns.password, 'invalidPassword');
  }

  phoneValidator(): ValidatorFn {
    return this.regexValidator(this.patterns.phone, 'invalidPhone');
  }

  zipCodeValidator(): ValidatorFn {
    return this.regexValidator(this.patterns.zipCode, 'invalidZipCode');
  }

  urlValidator(): ValidatorFn {
    return this.regexValidator(this.patterns.url, 'invalidUrl');
  }

  creditCardValidator(): ValidatorFn {
    return this.regexValidator(this.patterns.creditCard, 'invalidCreditCard');
  }

  // Custom pattern validator
  customPatternValidator(pattern: string | RegExp, errorName: string = 'patternMismatch'): ValidatorFn {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    return this.regexValidator(regex, errorName);
  }

  // SIMPLE VALIDATION METHODS (for non-reactive forms) ===========
  isValidEmail(email: string): boolean {
    return this.patterns.email.test(email.trim());
  }

  isValidPassword(password: string): boolean {
    return this.patterns.password.test(password.trim());
  }

  isValidUrl(url: string): boolean {
    return this.patterns.url.test(url.trim());
  }
}