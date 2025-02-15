import { useState, useCallback } from 'react';

interface ApiHookResult<T, E = Error> {
    data: T | null;
    loading: boolean;
    error: E | null;
    execute: (...args: unknown[]) => Promise<T>;
    reset: () => void;
}

export function useApi<T = unknown, E = Error>(
    apiFunction: (...args: unknown[]) => Promise<T>,
    options?: {
        onSuccess?: (data: T) => void;
        onError?: (error: E) => void;
        immediate?: boolean;
        initialArgs?: unknown[];
    }
): ApiHookResult<T, E> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(!!options?.immediate);
    const [error, setError] = useState<E | null>(null);

    const execute = useCallback(
        async (...args: unknown[]) => {
            try {
                setLoading(true);
                setError(null);
                const result = await apiFunction(...args);
                setData(result);
                options?.onSuccess?.(result);
                return result;
            } catch (err) {
                const error = err as E;
                setError(error);
                options?.onError?.(error);
                throw error;
            } finally {
                setLoading(false);
            }
        },
        [apiFunction, options]
    );

    const reset = useCallback(() => {
        setData(null);
        setLoading(false);
        setError(null);
    }, []);

    // Execute immediately if option is set
    useState(() => {
        if (options?.immediate) {
            execute(...(options.initialArgs || []));
        }
    });

    return {
        data,
        loading,
        error,
        execute,
        reset,
    };
}
