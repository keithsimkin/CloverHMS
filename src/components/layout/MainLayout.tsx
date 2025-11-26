import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import { Header } from './Header';
import { TauriTitleBar } from './TauriTitleBar';
import { cn } from '@/lib/utils';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header breadcrumbs={breadcrumbs} />
        <main className={cn('flex-1 overflow-y-auto p-4 sm:p-6', className)}>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
