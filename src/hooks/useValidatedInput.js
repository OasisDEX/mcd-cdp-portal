import { useState, useCallback } from 'react';

export default function useValidatedInput(initialValue, validationSchema) {
  const [value, setValue] = useState(initialValue);
  const [errors, setErrors] = useState('');

  const validate = useCallback(
    value => {
      const errors = [];

      const amount = parseFloat(value);
      if (validationSchema.isFloat && isNaN(amount)) {
        errors.push('Please enter a valid number');
      }
      if (amount <= validationSchema.minFloat) {
        errors.push(`Amount must be greater than ${validationSchema.minFloat}`);
      }
      if (amount > validationSchema.maxFloat) {
        errors.push(`Amount must be less than ${validationSchema.maxFloat}`);
      }

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
