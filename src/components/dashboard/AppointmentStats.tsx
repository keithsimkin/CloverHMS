import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, memo } from 'react';

export interface AppointmentData {
  date: string;
  count: number;
  scheduled: number;
  completed: number;
  cancelled: number;
}

interface AppointmentStatsProps {
  dailyData: AppointmentData[];
  weeklyData: AppointmentData[];
  monthlyData: AppointmentData[];
}

export const AppointmentStats = memo(function AppointmentStats({
  dailyData,
  weeklyData,
  monthlyData,
}: AppointmentStatsProps) {
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');

  const getCurrentData = () => {
    switch (view) {
      case 'day':
        return dailyData;
      case 'week':
        return weeklyData;
      case 'month':
        return monthlyData;
      default:
        return weeklyData;
    }
  };

  const data = getCurrentData();
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  const totalAppointments = data.reduce((sum, d) => sum + d.count, 0);
  const totalCompleted = data.reduce((sum, d) => sum + d.completed, 0);
  const completionRate =
    totalAppointments > 0
      ? ((totalCompleted / totalAppointments) * 100).toFixed(1)
      : '0.0';

  return (
    <Card className="p-6 bg-gunmetal border-border">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Appointment Statistics
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Appointment trends over time
            </p>
          </div>
          <Tabs value={view} onValueChange={(v) => setView(v as any)}>
            <TabsList className="bg-prussian-blue">
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-rich-black rounded-lg">
          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-2xl font-bold text-foreground">
              {totalAppointments}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold text-green-400">{totalCompleted}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Completion Rate</p>
            <p className="text-2xl font-bold text-blue-400">{completionRate}%</p>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">
                  {item.date}
                </span>
                <span className="text-foreground font-semibold">
                  {item.count}
                </span>
              </div>
              <div className="relative h-8 bg-rich-black rounded overflow-hidden">
                {/* Total bar */}
                <div
                  className="absolute h-full bg-prussian-blue transition-all"
                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                />
                {/* Completed bar */}
                <div
                  className="absolute h-full bg-green-400/30 transition-all"
                  style={{ width: `${(item.completed / maxCount) * 100}%` }}
                />
                {/* Cancelled bar */}
                {item.cancelled > 0 && (
                  <div
                    className="absolute h-full bg-imperial-red/30 transition-all"
                    style={{
                      width: `${(item.cancelled / maxCount) * 100}%`,
                      left: `${(item.completed / maxCount) * 100}%`,
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-prussian-blue rounded" />
            <span className="text-muted-foreground">Scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded" />
            <span className="text-muted-foreground">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-imperial-red rounded" />
            <span className="text-muted-foreground">Cancelled</span>
          </div>
        </div>
      </div>
    </Card>
  );
});
