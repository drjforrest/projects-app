import { NavLink } from './NavLink';
import { CommandPalette } from './CommandPalette';
import { NotificationBell } from './NotificationBell';

export const DesktopNav = () => {
    return (
        <div className="hidden lg:block">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex space-x-4">
                        <NavLink href="/">Home</NavLink>
                        <NavLink href="/projects">Projects</NavLink>
                        <NavLink href="/start-project">Start Project</NavLink>
                        <NavLink href="/outputs">Outputs</NavLink>
                        <NavLink href="/meetings">Meetings</NavLink>
                    </div>
                    <div className="flex items-center space-x-2">
                        <CommandPalette />
                        <NotificationBell />
                        <NavLink href="/settings">Settings</NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
}; 