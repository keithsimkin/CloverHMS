import { Link } from '@tanstack/react-router';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Calendar,
  UserCog,
  Package,
  Stethoscope,
  Activity,
  Siren,
  TestTube,
  Pill,
  CreditCard,
  Bed,
  Droplet,
  Ambulance,
  DollarSign,
  FileText,
  MessageSquare,
  PackageOpen,
  HelpCircle,
  FileStack,
  Building2,
  Settings,
  X,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePermissions } from '@/hooks/usePermissions';
import { Permission } from '@/types/enums';
import { useTabNavigation } from '@/hooks/useTabNavigation';
import { useState, MouseEvent } from 'react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredPermissions?: Permission[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigationSections: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { title: 'Dashboard', href: '/', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Core Modules',
    items: [
      { 
        title: 'Patients', 
        href: '/patients', 
        icon: Users,
        requiredPermissions: [Permission.PATIENT_VIEW],
      },
      { 
        title: 'Appointments', 
        href: '/appointments', 
        icon: Calendar,
        requiredPermissions: [Permission.APPOINTMENT_VIEW],
      },
      { 
        title: 'Staff', 
        href: '/staff', 
        icon: UserCog,
        requiredPermissions: [Permission.STAFF_VIEW],
      },
      { 
        title: 'Inventory', 
        href: '/inventory', 
        icon: Package,
        requiredPermissions: [Permission.INVENTORY_VIEW],
      },
    ],
  },
  {
    title: 'Clinical',
    items: [
      { 
        title: 'Clinical', 
        href: '/clinical', 
        icon: Stethoscope,
        requiredPermissions: [Permission.CLINICAL_VIEW],
      },
      { 
        title: 'Patient Flow', 
        href: '/patient-flow', 
        icon: Activity,
        requiredPermissions: [Permission.FLOW_VIEW],
      },
      { 
        title: 'Triage', 
        href: '/triage', 
        icon: Siren,
        requiredPermissions: [Permission.TRIAGE_PERFORM],
      },
      { 
        title: 'Laboratory', 
        href: '/laboratory', 
        icon: TestTube,
        requiredPermissions: [Permission.LAB_VIEW],
      },
      { 
        title: 'Pharmacy', 
        href: '/pharmacy', 
        icon: Pill,
        requiredPermissions: [Permission.PHARMACY_VIEW],
      },
      { 
        title: 'Billing', 
        href: '/billing', 
        icon: CreditCard,
        requiredPermissions: [Permission.BILLING_VIEW],
      },
    ],
  },
  {
    title: 'Extended Services',
    items: [
      { 
        title: 'Bed Management', 
        href: '/beds', 
        icon: Bed,
        requiredPermissions: [Permission.BED_VIEW],
      },
      { 
        title: 'Blood Donors', 
        href: '/blood-donors', 
        icon: Droplet,
        requiredPermissions: [Permission.BLOOD_BANK_VIEW],
      },
      { 
        title: 'Blood Inventory', 
        href: '/blood-bank', 
        icon: Droplet,
        requiredPermissions: [Permission.BLOOD_BANK_VIEW],
      },
      { 
        title: 'Ambulances', 
        href: '/ambulances', 
        icon: Ambulance,
        requiredPermissions: [Permission.EMERGENCY_VIEW],
      },
      { 
        title: 'Emergency Calls', 
        href: '/emergency-calls', 
        icon: Siren,
        requiredPermissions: [Permission.EMERGENCY_VIEW],
      },
      { 
        title: 'Emergency Cases', 
        href: '/emergency-cases', 
        icon: AlertTriangle,
        requiredPermissions: [Permission.EMERGENCY_VIEW],
      },
      { 
        title: 'OPD', 
        href: '/opd', 
        icon: Building2,
        requiredPermissions: [Permission.OPD_VIEW],
      },
      { 
        title: 'IPD', 
        href: '/ipd', 
        icon: Bed,
        requiredPermissions: [Permission.IPD_VIEW],
      },
    ],
  },
  {
    title: 'Financial',
    items: [
      { 
        title: 'Insurance', 
        href: '/insurance', 
        icon: DollarSign,
        requiredPermissions: [Permission.FINANCIAL_VIEW],
      },
      { 
        title: 'Advance Payments', 
        href: '/advance-payments', 
        icon: DollarSign,
        requiredPermissions: [Permission.FINANCIAL_VIEW],
      },
      { 
        title: 'Expenses', 
        href: '/expenses', 
        icon: DollarSign,
        requiredPermissions: [Permission.FINANCIAL_VIEW],
      },
      { 
        title: 'Income', 
        href: '/income', 
        icon: DollarSign,
        requiredPermissions: [Permission.FINANCIAL_VIEW],
      },
      { 
        title: 'Hospital Charges', 
        href: '/hospital-charges', 
        icon: DollarSign,
        requiredPermissions: [Permission.FINANCIAL_VIEW],
      },
      { 
        title: 'Payroll', 
        href: '/payroll', 
        icon: DollarSign,
        requiredPermissions: [Permission.PAYROLL_VIEW],
      },
    ],
  },
  {
    title: 'Reports & Communication',
    items: [
      { 
        title: 'Birth Reports', 
        href: '/birth-reports', 
        icon: FileText,
        requiredPermissions: [Permission.REPORTS_VIEW],
      },
      { 
        title: 'Death Reports', 
        href: '/death-reports', 
        icon: FileText,
        requiredPermissions: [Permission.REPORTS_VIEW],
      },
      { 
        title: 'Operation Reports', 
        href: '/operation-reports', 
        icon: FileText,
        requiredPermissions: [Permission.REPORTS_VIEW],
      },
      { 
        title: 'Notice Board', 
        href: '/notice-board', 
        icon: MessageSquare,
        requiredPermissions: [Permission.COMMUNICATION_VIEW],
      },
      { 
        title: 'Internal Mail', 
        href: '/internal-mail', 
        icon: MessageSquare,
        requiredPermissions: [Permission.COMMUNICATION_VIEW],
      },
      { 
        title: 'Staff Schedules', 
        href: '/staff-schedules', 
        icon: Calendar,
        requiredPermissions: [Permission.COMMUNICATION_VIEW],
      },
    ],
  },
  {
    title: 'Services & Quality',
    items: [
      { 
        title: 'Service Packages', 
        href: '/packages', 
        icon: PackageOpen,
        requiredPermissions: [Permission.PACKAGE_VIEW],
      },
      { 
        title: 'Doctor Charges', 
        href: '/doctor-charges', 
        icon: DollarSign,
        requiredPermissions: [Permission.PACKAGE_VIEW],
      },
      { 
        title: 'Inquiries', 
        href: '/quality', 
        icon: HelpCircle,
        requiredPermissions: [Permission.INQUIRY_VIEW],
      },
      { 
        title: 'Documents', 
        href: '/documents', 
        icon: FileStack,
        requiredPermissions: [Permission.DOCUMENT_VIEW],
      },
    ],
  },
  {
    title: 'System',
    items: [
      { 
        title: 'Settings', 
        href: '/settings', 
        icon: Settings,
        requiredPermissions: [Permission.SETTINGS_VIEW],
      },
    ],
  },
];

interface SidebarProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ className, isOpen = true, onClose }: SidebarProps) {
  const { hasAnyPermission } = usePermissions();
  const { navigateToTab, openInNewTab } = useTabNavigation();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: NavItem } | null>(null);

  // Filter navigation items based on permissions
  const filteredSections = navigationSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        // If no permissions required, show the item
        if (!item.requiredPermissions || item.requiredPermissions.length === 0) {
          return true;
        }
        // Check if user has any of the required permissions
        return hasAnyPermission(item.requiredPermissions);
      }),
    }))
    .filter((section) => section.items.length > 0); // Remove empty sections

  // Handle link click with tab support
  const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    // Ctrl+Click or Cmd+Click: Open in new tab
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      openInNewTab(item.href, item.title);
      return;
    }

    // Default behavior: Navigate in current tab
    e.preventDefault();
    navigateToTab(item.href, item.title);
    onClose?.(); // Close mobile menu on navigation
  };

  // Handle middle-click (auxClick)
  const handleAuxClick = (e: MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    if (e.button === 1) { // Middle mouse button
      e.preventDefault();
      openInNewTab(item.href, item.title);
    }
  };

  // Handle right-click for context menu
  const handleContextMenu = (e: MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, item });
  };

  const sidebarContent = (
    <>
      {/* Logo/Brand */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-border">
        <h1 className="text-xl font-heading font-bold text-foreground">
          HMS
        </h1>
        {/* Close button for mobile */}
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-6">
          {filteredSections.map((section, index) => (
            <div key={section.title}>
              <h2 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {section.title}
              </h2>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={(e) => handleLinkClick(e, item)}
                    onAuxClick={(e) => handleAuxClick(e, item)}
                    onContextMenu={(e) => handleContextMenu(e, item)}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-prussian-blue hover:text-foreground text-cool-gray [&.active]:bg-prussian-blue [&.active]:text-foreground min-h-touch lg:min-h-0"
                    activeProps={{
                      className: 'bg-prussian-blue text-foreground',
                    }}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.title}</span>
                  </Link>
                ))}
              </div>
              {index !== filteredSections.length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col w-64 h-screen bg-gunmetal border-r border-border',
          className
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar - Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
          {/* Sidebar */}
          <aside
            className={cn(
              'fixed inset-y-0 left-0 z-50 flex flex-col w-64 sm:w-72 h-screen bg-gunmetal border-r border-border lg:hidden',
              'transform transition-transform duration-300 ease-in-out',
              isOpen ? 'translate-x-0' : '-translate-x-full',
              className
            )}
          >
            {sidebarContent}
          </aside>
        </>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <DropdownMenu open={!!contextMenu} onOpenChange={(open) => !open && setContextMenu(null)}>
          <DropdownMenuTrigger asChild>
            <div
              style={{
                position: 'fixed',
                left: contextMenu.x,
                top: contextMenu.y,
                width: 0,
                height: 0,
              }}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={() => {
                openInNewTab(contextMenu.item.href, contextMenu.item.title);
                setContextMenu(null);
              }}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in New Tab
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
