import { NavLink } from './NavLink';
import { CommandPalette } from './CommandPalette';
import { NotificationBell } from './NotificationBell';
import type { Route } from 'next';

export const DesktopNav = () => {
    return (
        <div className="hidden lg:block">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex space-x-4">
                        <NavLink href={'/' as Route}>Home</NavLink>
                        <NavLink href={'/projects' as Route}>Projects</NavLink>
                        <NavLink href={'/start-project' as Route}>Start Project</NavLink>
                        <NavLink href={'/outputs' as Route}>Outputs</NavLink>
                        <NavLink href={'/meetings' as Route}>Meetings</NavLink>
                    </div>
                    <div className="flex items-center space-x-2">
                        <CommandPalette />
                        <NotificationBell />
                        <NavLink href={'/settings' as Route}>Settings</NavLink>
                    </div>
                </div> 
            </div>
        </div>
    );
}; 