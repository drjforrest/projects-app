'use client';

import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';
import { Breadcrumb } from './Breadcrumb';
import { ProjectMenu } from './ProjectMenu';
import { QuickActions } from './QuickActions';

export function Navigation() {
    return (
        <>
            <nav className="bg-navy-900 shadow-lg">
                <DesktopNav />
                <MobileNav />
            </nav>
            <div className="max-w-7xl mx-auto px-4 py-6">
                <Breadcrumb />
                <ProjectMenu />
            </div>
            <QuickActions />
        </>
    );
} 