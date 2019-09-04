import { useState, useCallback } from 'react';

export default function useActionState(
  action,
  errorMessage = 'An error occurred. Please try again.'
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const onAction = useCallback(async () => {
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      const res = await action();
      setIsLoading(false);
      setSuccess(true);
      setError('');
      return res;
    } catch (err) {
      setIsLoading(false);
      setError(err.toString());
    }
  }, [action, setIsLoading, setError]);

  return [onAction, isLoading, success, error];
}
