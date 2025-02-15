import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface DocumentUploadProps {
    onUpload: (path: string, content?: string) => void;
    label: string;
    accept?: string;
    maxSize?: number;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
    onUpload,
    label,
    accept = '.txt,.doc,.docx,.pdf',
    maxSize = 10 * 1024 * 1024 // 10MB
}) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        const file = acceptedFiles[0];
        setUploading(true);
        setError(null);

        try {
            // Here you would typically upload to your file storage
            // For now, we'll just simulate the upload and return a local path
            const path = `/uploads/meetings/${Date.now()}-${file.name}`;
            
            // If it's a text file, we can read its content
            if (file.type === 'text/plain') {
                const content = await file.text();
                onUpload(path, content);
            } else {
                onUpload(path);
            }
        } catch (err) {
            setError('Failed to upload file. Please try again.');
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
        }
    }, [onUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/plain': ['.txt'],
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        maxSize,
        multiple: false
    });

    return (
        <div className="space-y-2">
            <label className="form-label">{label}</label>
            <div
                {...getRootProps()}
                className={`
                    border-2 border-dashed rounded-lg p-6 transition-colors duration-200
                    ${isDragActive ? 'border-teal-500 bg-teal-50' : 'border-sage-300 hover:border-teal-400'}
                    ${error ? 'border-rust-500' : ''}
                `}
            >
                <input 
                    {...getInputProps()} 
                    accept={accept}
                    disabled={uploading}
                />
                <div className="text-center">
                    {uploading ? (
                        <div className="flex items-center justify-center">
                            <svg className="animate-spin h-5 w-5 text-teal-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Uploading...</span>
                        </div>
                    ) : isDragActive ? (
                        <p className="text-teal-600">Drop the file here</p>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-navy-600">
                                Drag and drop a file here, or click to select
                            </p>
                            <p className="text-sm text-sage-500">
                                Supported formats: TXT, DOC, DOCX, PDF (max {maxSize / 1024 / 1024}MB)
                            </p>
                        </div>
                    )}
                </div>
            </div>
            {error && (
                <p className="mt-1 text-sm text-rust-500 animate-slide-in">{error}</p>
            )}
        </div>
    );
};
