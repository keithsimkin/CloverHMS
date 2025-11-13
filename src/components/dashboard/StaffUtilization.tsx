import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface StaffWorkload {
  staffId: string;
  staffName: string;
  department: string;
  role: string;
  appointmentCount: number;
  hoursWorked: number;
  utilizationRate: number;
}

interface StaffUtilizationProps {
  staffWorkload: StaffWorkload[];
}

export function StaffUtilization({ staffWorkload }: StaffUtilizationProps) {
  const maxAppointments = Math.max(
    ...staffWorkload.map((s) => s.appointmentCount),
    1
  );

  const averageUtilization =
    staffWorkload.length > 0
      ? staffWorkload.reduce((sum, s) => sum + s.utilizationRate, 0) /
        staffWorkload.length
      : 0;

  const totalAppointments = staffWorkload.reduce(
    (sum, s) => sum + s.appointmentCount,
    0
  );

  const getUtilizationColor = (rate: number) => {
    if (rate >= 90) return 'text-imperial-red';
    if (rate >= 70) return 'text-warning';
    if (rate >= 50) return 'text-green-400';
    return 'text-cool-gray';
  };

  const getUtilizationBadge = (rate: number) => {
    if (rate >= 90)
      return (
        <Badge variant="destructive" className="text-xs">
          Overloaded
        </Badge>
      );
    if (rate >= 70)
      return (
        <Badge className="text-xs bg-warning text-rich-black">Busy</Badge>
      );
    if (rate >= 50)
      return (
        <Badge className="text-xs bg-green-400 text-rich-black">Optimal</Badge>
      );
    return (
      <Badge variant="outline" className="text-xs">
        Available
      </Badge>
    );
  };

  return (
    <Card className="p-6 bg-gunmetal border-border">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Staff Utilization
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Workload distribution across staff members
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-rich-black rounded-lg">
          <div>
            <p className="text-xs text-muted-foreground">Total Appointments</p>
            <p className="text-2xl font-bold text-foreground">
              {totalAppointments}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Avg Utilization</p>
            <p className="text-2xl font-bold text-blue-400">
              {averageUtilization.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Staff List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {staffWorkload.map((staff) => (
            <div
              key={staff.staffId}
              className="p-4 bg-rich-black rounded-lg space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {staff.staffName}
                    </p>
                    {getUtilizationBadge(staff.utilizationRate)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {staff.role} • {staff.department}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-lg font-bold ${getUtilizationColor(
                      staff.utilizationRate
                    )}`}
                  >
                    {staff.utilizationRate.toFixed(0)}%
                  </p>
                  <p className="text-xs text-muted-foreground">utilization</p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Appointments</span>
                  <span className="text-foreground font-medium">
                    {staff.appointmentCount}
                  </span>
                </div>
                <div className="relative h-2 bg-prussian-blue/30 rounded overflow-hidden">
                  <div
                    className={`absolute h-full transition-all ${
                      staff.utilizationRate >= 90
                        ? 'bg-imperial-red'
                        : staff.utilizationRate >= 70
                        ? 'bg-warning'
                        : 'bg-green-400'
                    }`}
                    style={{
                      width: `${(staff.appointmentCount / maxAppointments) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Hours Worked</span>
                <span className="text-foreground font-medium">
                  {staff.hoursWorked.toFixed(1)}h
                </span>
              </div>
            </div>
          ))}
        </div>

        {staffWorkload.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No staff utilization data available
          </div>
        )}
      </div>
    </Card>
  );
}
