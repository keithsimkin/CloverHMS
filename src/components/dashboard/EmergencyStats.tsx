import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

export interface EmergencyResponseData {
  caseId: string;
  emergencyType: string;
  responseTimeMinutes: number;
  status: 'received' | 'dispatched' | 'patient_picked_up' | 'arrived_at_hospital' | 'completed';
  priority: 'critical' | 'urgent' | 'moderate';
}

export interface EmergencyMetrics {
  averageResponseTime: number;
  totalCases: number;
  resolvedCases: number;
  activeCases: number;
}

interface EmergencyStatsProps {
  responseData: EmergencyResponseData[];
  metrics: EmergencyMetrics;
}

export function EmergencyStats({ responseData, metrics }: EmergencyStatsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-400 text-rich-black';
      case 'arrived_at_hospital':
        return 'bg-blue-400 text-rich-black';
      case 'patient_picked_up':
        return 'bg-cyan-400 text-rich-black';
      case 'dispatched':
        return 'bg-warning text-rich-black';
      default:
        return 'bg-cool-gray text-rich-black';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-imperial-red';
      case 'urgent':
        return 'text-warning';
      default:
        return 'text-blue-400';
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const resolutionRate =
    metrics.totalCases > 0
      ? ((metrics.resolvedCases / metrics.totalCases) * 100).toFixed(1)
      : '0';

  // Calculate response time distribution
  const responseTimeRanges = [
    { label: '< 5 min', count: 0, color: 'bg-green-400' },
    { label: '5-10 min', count: 0, color: 'bg-blue-400' },
    { label: '10-15 min', count: 0, color: 'bg-warning' },
    { label: '> 15 min', count: 0, color: 'bg-imperial-red' },
  ];

  responseData.forEach((data) => {
    if (data.responseTimeMinutes < 5) responseTimeRanges[0].count++;
    else if (data.responseTimeMinutes < 10) responseTimeRanges[1].count++;
    else if (data.responseTimeMinutes < 15) responseTimeRanges[2].count++;
    else responseTimeRanges[3].count++;
  });

  const maxRangeCount = Math.max(...responseTimeRanges.map((r) => r.count), 1);

  return (
    <Card className="p-6 bg-gunmetal border-border">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Emergency Response
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Response times and case resolution metrics
          </p>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-rich-black rounded-lg">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <Clock className="h-4 w-4" />
              <p className="text-xs font-medium">Avg Response</p>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {metrics.averageResponseTime.toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground">minutes</p>
          </div>
          <div className="p-4 bg-rich-black rounded-lg">
            <div className="flex items-center gap-2 text-purple-400 mb-2">
              <AlertCircle className="h-4 w-4" />
              <p className="text-xs font-medium">Total Cases</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{metrics.totalCases}</p>
          </div>
          <div className="p-4 bg-rich-black rounded-lg">
            <div className="flex items-center gap-2 text-green-400 mb-2">
              <CheckCircle className="h-4 w-4" />
              <p className="text-xs font-medium">Resolved</p>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {metrics.resolvedCases}
            </p>
            <p className="text-xs text-muted-foreground">{resolutionRate}%</p>
          </div>
          <div className="p-4 bg-rich-black rounded-lg">
            <div className="flex items-center gap-2 text-warning mb-2">
              <AlertCircle className="h-4 w-4" />
              <p className="text-xs font-medium">Active</p>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {metrics.activeCases}
            </p>
          </div>
        </div>

        {/* Response Time Distribution */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">
            Response Time Distribution
          </h4>
          <div className="space-y-2">
            {responseTimeRanges.map((range, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{range.label}</span>
                  <span className="text-foreground font-medium">{range.count}</span>
                </div>
                <div className="relative h-6 bg-rich-black rounded overflow-hidden">
                  <div
                    className={`absolute h-full ${range.color} transition-all`}
                    style={{ width: `${(range.count / maxRangeCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Cases */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Recent Cases</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {responseData.slice(0, 5).map((data) => (
              <div
                key={data.caseId}
                className="p-3 bg-rich-black rounded-lg flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-foreground">
                      {data.emergencyType}
                    </p>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getPriorityColor(data.priority)}`}
                    >
                      {data.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${getStatusColor(data.status)}`}>
                      {formatStatus(data.status)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Response: {data.responseTimeMinutes} min
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {responseData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No emergency response data available
          </div>
        )}
      </div>
    </Card>
  );
}
