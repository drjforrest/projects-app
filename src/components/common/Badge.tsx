import React from 'react';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    size?: BadgeSize;
    rounded?: boolean;
    icon?: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    rounded = false,
    icon,
    onClick,
    className = ''
}) => {
    const baseClasses = 'inline-flex items-center font-medium';
    
    const variantClasses = {
        primary: 'bg-teal-100 text-teal-800',
        secondary: 'bg-sage-100 text-sage-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-gold-100 text-gold-800',
        danger: 'bg-rust-100 text-rust-800',
        info: 'bg-blue-100 text-blue-800'
    };

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-sm',
        lg: 'px-3 py-1 text-base'
    };

    const classes = [
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        rounded ? 'rounded-full' : 'rounded',
        onClick ? 'cursor-pointer hover:opacity-80' : '',
        className
    ].join(' ');

    return (
        <span className={classes} onClick={onClick}>
            {icon && <span className="mr-1.5 -ml-0.5">{icon}</span>}
            {children}
        </span>
    );
};

// Preset badges for common use cases
export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const getVariant = (): BadgeVariant => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'success';
            case 'pending':
                return 'warning';
            case 'completed':
                return 'primary';
            case 'cancelled':
                return 'danger';
            case 'on hold':
                return 'secondary';
            default:
                return 'info';
        }
    };

    return (
        <Badge variant={getVariant()} rounded>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
    );
};

export const PriorityBadge: React.FC<{ priority: 'low' | 'medium' | 'high' }> = ({ priority }) => {
    const config = {
        low: { variant: 'success' as const, icon: '↓' },
        medium: { variant: 'warning' as const, icon: '→' },
        high: { variant: 'danger' as const, icon: '↑' }
    };

    return (
        <Badge 
            variant={config[priority].variant} 
            icon={<span>{config[priority].icon}</span>}
            rounded
        >
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </Badge>
    );
};
