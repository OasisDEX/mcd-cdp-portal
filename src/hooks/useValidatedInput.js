import { useState, useCallback } from 'react';

/**
 * Example schema:
 *  { minFloat: 0, maxFloat: 10, isFloat: true, custom: { isEven: (value) => parseFloat(value) % 2 === 0 } }
 * Custom messages should match any custom or built in validator by key.
 */

export default function useValidatedInput(
  initialValue,
  validationSchema,
  customMessages = {}
) {
  const [value, setValue] = useState(initialValue);
  const [errors, setErrors] = useState('');

  const validate = useCallback(
    value => {
      const errors = [];

      const amount = parseFloat(value);
      if (validationSchema.isFloat && isNaN(amount)) {
        errors.push(customMessages.isFloat || 'Please enter a valid number');
      }
      if (amount <= validationSchema.minFloat) {
        errors.push(
          customMessages.minFloat ||
            `Amount must be greater than ${validationSchema.minFloat}`
        );
      }
      if (amount > validationSchema.maxFloat) {
        errors.push(
          customMessages.maxFloat(value) ||
            `Amount must be less than ${validationSchema.maxFloat}`
        );
      }

      Object.entries(validationSchema.custom || {}).forEach(
        ([name, validation]) => {
          if (!validation(value)) {
            const errorMessage =
              customMessages[name] && customMessages[name](value);
            errors.push(errorMessage || 'This input is invalid');
          }
        }
      );

      return errors.join(', ');
    },
    [validationSchema]
  );

  const onChange = useCallback(
    event => {
      const value = event.target.value;
      setErrors(validate(value));
      setValue(value);
    },
    [setValue, setErrors, validate]
  );

  const setValueAndValidate = useCallback(
    (newValue, options = { validate: true }) => {
      if (options.validate) setErrors(validate(newValue));
      setValue(newValue);
    },
    [setValue, setErrors, validate]
  );

  return [value, setValueAndValidate, onChange, errors];
}
