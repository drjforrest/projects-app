import React from 'react';

interface ErrorStateProps {
    error: Error | string;
    resetError?: () => void;
    className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
    error,
    resetError,
    className = ''
}) => {
    const errorMessage = error instanceof Error ? error.message : error;

    return (
        <div className={`rounded-lg bg-rust-50 p-4 ${className}`}>
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <svg 
                        className="h-5 w-5 text-rust-400" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                    >
                        <path 
                            fillRule="evenodd" 
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                            clipRule="evenodd" 
                        />
                    </svg>
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-rust-800">
                        An error occurred
                    </h3>
                    <div className="mt-2 text-sm text-rust-700">
                        <p>{errorMessage}</p>
                    </div>
                    {resetError && (
                        <button
                            type="button"
                            onClick={resetError}
                            className="mt-4 text-sm font-medium text-rust-600 hover:text-rust-500 focus:outline-none focus:ring-2 focus:ring-rust-500 focus:ring-offset-2"
                        >
                            Try again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export const ErrorBoundary: React.FC<{
    children: React.ReactNode;
    fallback?: React.ReactNode;
}> = ({ children, fallback }) => {
    const [hasError, setHasError] = React.useState(false);
    const [error, setError] = React.useState<Error | null>(null);

    React.useEffect(() => {
        const handleError = (error: Error) => {
            console.error('Caught error:', error);
            setError(error);
            setHasError(true);
        };

        window.addEventListener('error', (event) => handleError(event.error));
        window.addEventListener('unhandledrejection', (event) => handleError(event.reason));

        return () => {
            window.removeEventListener('error', (event) => handleError(event.error));
            window.removeEventListener('unhandledrejection', (event) => handleError(event.reason));
        };
    }, []);

    if (hasError) {
        return fallback ? (
            <>{fallback}</>
        ) : (
            <ErrorState 
                error={error?.message || 'An unexpected error occurred'} 
                resetError={() => setHasError(false)}
            />
        );
    }

    return <>{children}</>;
};
