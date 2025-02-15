import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    mobile?: boolean;
}

export const NavLink = ({ href, children, mobile }: NavLinkProps) => {
    const pathname = usePathname();
    const isActive = pathname === href;
    
    return (
        <Link
            href={href}
            className={cn(
                "transition-all duration-200",
                mobile ? (
                    "text-sage-300 hover:text-gold-400 text-lg py-2"
                ) : (
                    "flex items-center px-3 py-2 text-sage-300 hover:text-gold-400 hover:-translate-y-0.5"
                ),
                isActive && "text-gold-400"
            )}
        >
            {children}
        </Link>
    );
}; 