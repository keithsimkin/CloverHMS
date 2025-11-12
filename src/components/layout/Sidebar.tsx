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
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
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
      { title: 'Patients', href: '/patients', icon: Users },
      { title: 'Appointments', href: '/appointments', icon: Calendar },
      { title: 'Staff', href: '/staff', icon: UserCog },
      { title: 'Inventory', href: '/inventory', icon: Package },
    ],
  },
  {
    title: 'Clinical',
    items: [
      { title: 'Clinical', href: '/clinical', icon: Stethoscope },
      { title: 'Patient Flow', href: '/patient-flow', icon: Activity },
      { title: 'Triage', href: '/triage', icon: Siren },
      { title: 'Laboratory', href: '/laboratory', icon: TestTube },
      { title: 'Pharmacy', href: '/pharmacy', icon: Pill },
      { title: 'Billing', href: '/billing', icon: CreditCard },
    ],
  },
  {
    title: 'Extended Services',
    items: [
      { title: 'Bed Management', href: '/beds', icon: Bed },
      { title: 'Blood Bank', href: '/blood-bank', icon: Droplet },
      { title: 'Emergency', href: '/emergency', icon: Ambulance },
      { title: 'OPD', href: '/opd', icon: Building2 },
      { title: 'IPD', href: '/ipd', icon: Bed },
    ],
  },
  {
    title: 'Financial',
    items: [
      { title: 'Insurance', href: '/insurance', icon: DollarSign },
      { title: 'Expenses', href: '/expenses', icon: DollarSign },
      { title: 'Payroll', href: '/payroll', icon: DollarSign },
    ],
  },
  {
    title: 'Management',
    items: [
      { title: 'Reports', href: '/reports', icon: FileText },
      { title: 'Communication', href: '/communication', icon: MessageSquare },
      { title: 'Service Packages', href: '/packages', icon: PackageOpen },
      { title: 'Quality', href: '/quality', icon: HelpCircle },
      { title: 'Documents', href: '/documents', icon: FileStack },
    ],
  },
  {
    title: 'System',
    items: [
      { title: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex flex-col w-64 h-screen bg-gunmetal border-r border-border',
        className
      )}
    >
      {/* Logo/Brand */}
      <div className="flex items-center h-16 px-6 border-b border-border">
        <h1 className="text-xl font-heading font-bold text-foreground">
          HMS
        </h1>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-6">
          {navigationSections.map((section) => (
            <div key={section.title}>
              <h2 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {section.title}
              </h2>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-prussian-blue hover:text-foreground text-cool-gray [&.active]:bg-prussian-blue [&.active]:text-foreground"
                    activeProps={{
                      className: 'bg-prussian-blue text-foreground',
                    }}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </Link>
                ))}
              </div>
              {section !== navigationSections[navigationSections.length - 1] && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}
