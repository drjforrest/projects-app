import { useEffect, useState } from 'react';

interface FileWatcherOptions {
    path: string;
    interval?: number;
    onUpdate?: (content: string) => void;
    onError?: (error: Error) => void;
}

export const useFileWatcher = ({
    path,
    interval = 5000, // 5 seconds
    onUpdate,
    onError
}: FileWatcherOptions) => {
    const [content, setContent] = useState<string | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [lastModified, setLastModified] = useState<Date | null>(null);

    useEffect(() => {
        let mounted = true;
        let timeoutId: NodeJS.Timeout;

        const checkFile = async () => {
            try {
                const fileInfo = await window.fs.stat(path);
                const currentModified = new Date(fileInfo.mtime);

                // Check if file has been modified
                if (!lastModified || currentModified > lastModified) {
                    const fileContent = await window.fs.readFile(path, { encoding: 'utf8' });
                    
                    if (mounted) {
                        setContent(fileContent);
                        setLastModified(currentModified);
                        setError(null);
                        onUpdate?.(fileContent);
                    }
                }
            } catch (err) {
                const error = err instanceof Error ? err : new Error(String(err));
                if (mounted) {
                    setError(error);
                    onError?.(error);
                }
            }

            if (mounted) {
                timeoutId = setTimeout(checkFile, interval);
            }
        };

        checkFile();

        return () => {
            mounted = false;
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [path, interval, onUpdate, onError, lastModified]);

    return {
        content,
        error,
        lastModified
    };
};

// Example usage:
/*
function OutputViewer({ outputPath }: { outputPath: string }) {
    const { content, error, lastModified } = useFileWatcher({
        path: outputPath,
        onUpdate: (content) => {
            console.log('File updated:', content);
        },
        onError: (error) => {
            console.error('File watch error:', error);
        }
    });

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!content) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <pre>{content}</pre>
            {lastModified && (
                <div>Last modified: {lastModified.toLocaleString()}</div>
            )}
        </div>
    );
}
*/
