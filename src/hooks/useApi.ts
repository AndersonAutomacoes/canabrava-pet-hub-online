
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface ApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  showToast?: boolean;
}

export const useApi = <T = any>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  });
  const { toast } = useToast();

  const execute = useCallback(async (
    apiCall: () => Promise<T>,
    options: ApiOptions = {}
  ) => {
    const { onSuccess, onError, showToast = true } = options;
    
    setState({ data: null, loading: true, error: null });

    try {
      const result = await apiCall();
      setState({ data: result, loading: false, error: null });
      
      if (onSuccess) onSuccess(result);
      
      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'Erro inesperado';
      setState({ data: null, loading: false, error: errorMessage });
      
      if (showToast) {
        toast({
          title: 'Erro',
          description: errorMessage,
          variant: 'destructive'
        });
      }
      
      if (onError) onError(errorMessage);
      throw error;
    }
  }, [toast]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset
  };
};
