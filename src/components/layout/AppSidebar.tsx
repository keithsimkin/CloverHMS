import { Link } from '@tanstack/react-router';
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
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { Permission } from '@/types/enums';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

export function AppSidebar() {
  const { hasAnyPermission } = usePermissions();
  const { navigateToTab, openInNewTab } = useTabNavigation();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: NavItem } | null>(null);

  // Filter navigation items based on permissions
  const filteredSections = navigationSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        if (!item.requiredPermissions || item.requiredPermissions.length === 0) {
          return true;
        }
        return hasAnyPermission(item.requiredPermissions);
      }),
    }))
    .filter((section) => section.items.length > 0);

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

  return (
    <>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <LayoutDashboard className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-heading font-semibold">HMS</span>
              <span className="text-xs text-muted-foreground">Hospital Management</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          {filteredSections.map((section) => (
            <SidebarGroup key={section.title}>
              <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <Link
                          to={item.href}
                          onClick={(e) => handleLinkClick(e, item)}
                          onAuxClick={(e) => handleAuxClick(e, item)}
                          onContextMenu={(e) => handleContextMenu(e, item)}
                        >
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </Sidebar>

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
