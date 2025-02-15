interface Window {
    fs: {
        stat: (path: string) => Promise<{ mtime: Date }>;
        readFile: (path: string, options: { encoding: string }) => Promise<string>;
    }
} 