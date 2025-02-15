import React, { useState } from 'react';

interface TooltipProps {
    content: React.ReactNode;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
    className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
    content,
    children,
    position = 'top',
    delay = 200,
    className = ''
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState<number | null>(null);

    const showTooltip = () => {
        const id = window.setTimeout(() => {
            setIsVisible(true);
        }, delay);
        setTimeoutId(id);
    };

    const hideTooltip = () => {
        if (timeoutId) {
            window.clearTimeout(timeoutId);
            setTimeoutId(null);
        }
        setIsVisible(false);
    };

    const positionClasses = {
        top: 'bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2',
        bottom: 'top-full left-1/2 transform -translate-x-1/2 translate-y-2 mt-2',
        left: 'right-full top-1/2 transform -translate-y-1/2 -translate-x-2 mr-2',
        right: 'left-full top-1/2 transform -translate-y-1/2 translate-x-2 ml-2'
    };

    return (
        <div className="relative inline-block">
            <div
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
                onFocus={showTooltip}
                onBlur={hideTooltip}
            >
                {children}
            </div>
            {isVisible && (
                <div
                    className={`
                        absolute z-50 px-2 py-1 text-sm text-white bg-navy-900 
                        rounded shadow-lg whitespace-nowrap animate-fade-in
                        ${positionClasses[position]}
                        ${className}
                    `}
                    role="tooltip"
                >
                    {content}
                    <div
                        className={`
                            absolute w-2 h-2 bg-navy-900 transform rotate-45
                            ${position === 'top' ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1' : ''}
                            ${position === 'bottom' ? 'top-0 left-1/2 -translate-x-1/2 -translate-y-1' : ''}
                            ${position === 'left' ? 'right-0 top-1/2 -translate-y-1/2 translate-x-1' : ''}
                            ${position === 'right' ? 'left-0 top-1/2 -translate-y-1/2 -translate-x-1' : ''}
                        `}
                    />
                </div>
            )}
        </div>
    );
};
