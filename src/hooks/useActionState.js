import { useState, useCallback } from 'react';

export default function useActionState(
  action,
  errorMessage = 'An error occurred. Please try again.'
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const onAction = useCallback(async () => {
    setError('');
    setIsLoading(true);

    try {
      const res = await action();
      setIsLoading(false);
      setError('');
      return res;
    } catch (err) {
      console.log(error);
      setIsLoading(false);
      setError(err.toString());
    }
  }, [action, setIsLoading, setError]);

  return [onAction, isLoading, error];
}
