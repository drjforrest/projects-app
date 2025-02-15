import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    interactive?: boolean;
    onClick?: () => void;
    padding?: 'none' | 'small' | 'normal' | 'large';
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    interactive = false,
    onClick,
    padding = 'normal'
}) => {
    const getPaddingClass = () => {
        switch (padding) {
            case 'none':
                return '';
            case 'small':
                return 'p-3';
            case 'large':
                return 'p-8';
            default:
                return 'p-6';
        }
    };

    return (
        <div
            className={`
                bg-white rounded-lg shadow-md overflow-hidden
                ${interactive ? 'hover-card cursor-pointer' : ''}
                ${getPaddingClass()}
                ${className}
            `}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

interface CardHeaderProps {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
    title,
    subtitle,
    action
}) => {
    return (
        <div className="flex items-center justify-between mb-4">
            <div>
                <h3 className="text-lg font-medium text-navy-900">
                    {title}
                </h3>
                {subtitle && (
                    <p className="mt-1 text-sm text-sage-600">
                        {subtitle}
                    </p>
                )}
            </div>
            {action && (
                <div>
                    {action}
                </div>
            )}
        </div>
    );
};

interface StatCardProps {
    label: string;
    value: string | number;
    change?: {
        value: number;
        type: 'increase' | 'decrease';
    };
    icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
    label,
    value,
    change,
    icon
}) => {
    return (
        <Card className="relative">
            <div className="flex items-center">
                {icon && (
                    <div className="flex-shrink-0 p-3 bg-sage-100 rounded-lg">
                        {icon}
                    </div>
                )}
                <div className={icon ? 'ml-5' : ''}>
                    <p className="text-sm font-medium text-sage-600">
                        {label}
                    </p>
                    <p className="mt-1 text-3xl font-semibold text-navy-900">
                        {value}
                    </p>
                    {change && (
                        <p className={`mt-2 flex items-center text-sm ${
                            change.type === 'increase' ? 'text-teal-600' : 'text-rust-600'
                        }`}>
                            <span>
                                {change.type === 'increase' ? '↑' : '↓'} {Math.abs(change.value)}%
                            </span>
                            <span className="ml-2">from previous period</span>
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );
};

interface LinkCardProps extends CardProps {
    href: string;
    title: string;
    description?: string;
    icon?: React.ReactNode;
}

export const LinkCard: React.FC<LinkCardProps> = ({
    href,
    title,
    description,
    icon,
    ...cardProps
}) => {
    return (
        <a href={href} className="block">
            <Card interactive {...cardProps}>
                <div className="flex items-center">
                    {icon && (
                        <div className="flex-shrink-0 p-3 bg-sage-100 rounded-lg">
                            {icon}
                        </div>
                    )}
                    <div className={icon ? 'ml-4' : ''}>
                        <h3 className="text-lg font-medium text-navy-900">
                            {title}
                        </h3>
                        {description && (
                            <p className="mt-1 text-sm text-sage-600">
                                {description}
                            </p>
                        )}
                    </div>
                    <div className="ml-auto">
                        <svg 
                            className="h-5 w-5 text-sage-400" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M9 5l7 7-7 7" 
                            />
                        </svg>
                    </div>
                </div>
            </Card>
        </a>
    );
};
