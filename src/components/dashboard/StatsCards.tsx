import { memo } from 'react';
import { Card } from '@/components/ui/card';
import {
  Users,
  Calendar,
  UserCheck,
  Package,
  Bed,
  Droplet,
  AlertTriangle,
  MessageSquare,
} from 'lucide-react';

export interface DashboardStats {
  totalPatients: number;
  upcomingAppointments: number;
  activeStaff: number;
  lowStockItems: number;
  bedOccupancyRate: number;
  bloodInventoryStatus: {
    criticalTypes: number;
    totalUnits: number;
  };
  activeEmergencyCases: number;
  pendingInquiries: number;
}

interface StatsCardsProps {
  stats: DashboardStats;
}

export const StatsCards = memo(function StatsCards({ stats }: StatsCardsProps) {
  const statCards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients.toLocaleString(),
      icon: Users,
      description: 'Registered patients',
      color: 'text-blue-400',
    },
    {
      title: 'Upcoming Appointments',
      value: stats.upcomingAppointments.toLocaleString(),
      icon: Calendar,
      description: 'Next 24 hours',
      color: 'text-green-400',
    },
    {
      title: 'Active Staff',
      value: stats.activeStaff.toLocaleString(),
      icon: UserCheck,
      description: 'Currently employed',
      color: 'text-purple-400',
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems.toLocaleString(),
      icon: Package,
      description: 'Below threshold',
      color: stats.lowStockItems > 0 ? 'text-imperial-red' : 'text-cool-gray',
    },
    {
      title: 'Bed Occupancy',
      value: `${stats.bedOccupancyRate.toFixed(1)}%`,
      icon: Bed,
      description: 'Current occupancy',
      color: stats.bedOccupancyRate > 90 ? 'text-imperial-red' : 'text-cyan-400',
    },
    {
      title: 'Blood Inventory',
      value: `${stats.bloodInventoryStatus.totalUnits}`,
      icon: Droplet,
      description: `${stats.bloodInventoryStatus.criticalTypes} critical types`,
      color:
        stats.bloodInventoryStatus.criticalTypes > 0
          ? 'text-imperial-red'
          : 'text-cool-gray',
    },
    {
      title: 'Emergency Cases',
      value: stats.activeEmergencyCases.toLocaleString(),
      icon: AlertTriangle,
      description: 'Active cases',
      color: stats.activeEmergencyCases > 0 ? 'text-warning' : 'text-cool-gray',
    },
    {
      title: 'Pending Inquiries',
      value: stats.pendingInquiries.toLocaleString(),
      icon: MessageSquare,
      description: 'Awaiting response',
      color: stats.pendingInquiries > 0 ? 'text-warning' : 'text-cool-gray',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className="p-6 bg-gunmetal border-border hover:border-prussian-blue transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </div>
              <div className={`${stat.color}`}>
                <Icon className="h-8 w-8" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
});
