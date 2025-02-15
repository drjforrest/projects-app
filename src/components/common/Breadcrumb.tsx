'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Breadcrumb = () => {
    const pathname = usePathname();
    const paths = pathname.split('/').filter(Boolean);
    
    return (
        <nav className="mb-4 text-sm">
            <ol className="flex items-center space-x-2">
                <li>
                    <Link href="/" className="text-sage-600 hover:text-navy-700">
                        Home
                    </Link>
                </li>
                {paths.map((path, index) => (
                    <li key={path} className="flex items-center">
                        <span className="mx-2 text-gray-400">/</span>
                        <Link 
                            href={`/${paths.slice(0, index + 1).join('/')}`}
                            className="text-sage-600 hover:text-navy-700 capitalize"
                        >
                            {path.replace('-', ' ')}
                        </Link>
                    </li>
                ))}
            </ol>
        </nav>
    );
}; 