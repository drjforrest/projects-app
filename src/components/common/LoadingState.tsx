import React from 'react';

interface LoadingStateProps {
    message?: string;
    fullScreen?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
    message = 'Loading...',
    fullScreen = false
}) => {
    const content = (
        <div className="flex flex-col items-center justify-center space-y-4 p-8 animate-fade-in">
            <div className="relative">
                <div className="w-12 h-12 border-4 border-sage-200 rounded-full animate-spin-slow">
                    <div className="absolute top-0 left-0 w-12 h-12 border-4 border-teal-500 rounded-full animate-spin" 
                         style={{ 
                             borderRightColor: 'transparent',
                             borderBottomColor: 'transparent'
                         }}
                    ></div>
                </div>
            </div>
            <p className="text-navy-600 font-medium">{message}</p>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center">
                {content}
            </div>
        );
    }

    return content;
};

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4'
    };

    return (
        <div className={`relative ${sizeClasses[size]}`}>
            <div className={`${sizeClasses[size]} border-sage-200 rounded-full animate-spin-slow`}>
                <div 
                    className={`absolute top-0 left-0 ${sizeClasses[size]} border-teal-500 rounded-full animate-spin`}
                    style={{ 
                        borderRightColor: 'transparent',
                        borderBottomColor: 'transparent'
                    }}
                ></div>
            </div>
        </div>
    );
};
