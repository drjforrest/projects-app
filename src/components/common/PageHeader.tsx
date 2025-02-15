import React from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
    breadcrumbs?: {
        label: string;
        href: string;
    }[];
}

export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    subtitle,
    actions,
    breadcrumbs
}) => {
    return (
        <div className="border-b border-sage-200 pb-4 mb-6 animate-fade-in">
            {breadcrumbs && (
                <nav className="mb-4">
                    <ol className="flex items-center space-x-2 text-sm text-sage-600">
                        {breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={crumb.href}>
                                {index > 0 && (
                                    <li>
                                        <span className="text-sage-400">/</span>
                                    </li>
                                )}
                                <li>
                                    <a 
                                        href={crumb.href}
                                        className="hover:text-teal-600 transition-colors duration-200"
                                    >
                                        {crumb.label}
                                    </a>
                                </li>
                            </React.Fragment>
                        ))}
                    </ol>
                </nav>
            )}
            
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-navy-900">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="mt-2 text-sage-600">
                            {subtitle}
                        </p>
                    )}
                </div>
                {actions && (
                    <div className="flex space-x-3">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
};
