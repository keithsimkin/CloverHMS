import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface MainLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

export function MainLayout({ children, breadcrumbs, className }: MainLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMobileSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - Desktop and Mobile */}
      <Sidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={handleCloseSidebar}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden w-full lg:w-auto">
        {/* Header */}
        <Header 
          breadcrumbs={breadcrumbs} 
          onMenuClick={handleMenuClick}
        />

        {/* Page Content */}
        <main
          className={cn(
            'flex-1 overflow-y-auto p-4 sm:p-6',
            className
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
