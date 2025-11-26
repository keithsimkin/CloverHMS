import { Bell, LogOut, User, ChevronRight } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/authStore';
import { getUserFullName, getUserInitials, getRoleDisplayName } from '@/lib/auth';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/common/ThemeToggle';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface HeaderProps {
  breadcrumbs?: BreadcrumbItem[];
}

export function Header({ breadcrumbs = [] }: HeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const notificationCount = 3; // Mock notification count

  const handleLogout = () => {
    logout();
    navigate({ to: '/login' });
  };

  const handleProfile = () => {
    navigate({ to: '/settings' });
  };

  if (!user) {
    return null;
  }

  const userName = getUserFullName();
  const userInitials = getUserInitials();
  const userRole = getRoleDisplayName(user.role);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />

        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 ? (
          <nav className="flex items-center gap-2 text-sm min-w-0">
            {breadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center gap-2 min-w-0">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground hidden sm:block flex-shrink-0" />
                )}
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors hidden sm:inline truncate"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className="text-foreground font-medium truncate">
                    {item.label}
                  </span>
                )}
              </div>
            ))}
          </nav>
        ) : (
          <div className="text-sm text-muted-foreground hidden md:block truncate">
            Welcome to Hospital Management System
          </div>
        )}
      </div>

      {/* Right side - Theme Toggle, Notifications and User Menu */}
      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative flex-shrink-0"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {notificationCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {notificationCount}
            </Badge>
          )}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2 sm:px-3 flex-shrink-0"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-prussian-blue text-sm font-medium flex-shrink-0">
                {userInitials}
              </div>
              <div className="hidden xl:flex flex-col items-start">
                <span className="text-sm font-medium truncate max-w-[120px]">{userName}</span>
                <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                  {userRole}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfile}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate({ to: '/settings' })}>
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
