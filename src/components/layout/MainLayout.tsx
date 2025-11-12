import { ReactNode } from 'react';
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
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header breadcrumbs={breadcrumbs} />

        {/* Page Content */}
        <main
          className={cn(
            'flex-1 overflow-y-auto p-6',
            className
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
